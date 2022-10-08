import type { NormalizedCacheObject } from "@apollo/client";
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import merge from "deepmerge";
import isEqual from "lodash/isEqual";
import type { FC } from "react";
import { useMemo } from "react";


export const APOLLO_STATE_PROP_NAME = "__APOLLO_STATE__";

let apolloClient: ApolloClient<NormalizedCacheObject>;

const cache: InMemoryCache = new InMemoryCache({});

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  //   credentials: "same-origin",
});

const authLink = setContext((_, { headers }) => {
  // console.log(process.env.HASURA_ADMIN_SECRET_KEY);

  const token = "firebaseのtoken"; //TODO: tokenの設定
  if (token === "firebaseのtoken") {
    // 認証まわり実装前の動作確認用。絶対に消す。
    return {
      headers: {
        "x-hasura-admin-secret":
          process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET_KEY,
      },
    };
  }
  return token
    ? { headers: { ...headers, authorization: `Bearer ${token}` } }
    : { headers };
}
);

const createApolloClient = () => {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: typeof window === "undefined" ? httpLink : authLink.concat(httpLink),
    cache: cache,
  });
};

export const initializeApollo = (initialState = null) => {
  const _apolloClient = apolloClient ?? createApolloClient();

  // ページにApollo Clientを使用したNext.jsのデータ取得メソッドがある場合、初期状態はここでハイドレーション。
  if (initialState) {
    // クライアント側のデータ取得中に読み込まれた既存のキャッシュを取得。
    const existingCache = _apolloClient.extract();

    // 既存のキャッシュをgetStaticProps/getServerSidePropsから渡されたデータにマージ。
    const data = merge(initialState, existingCache, {
      // オブジェクトの平等性を利用して配列を結合。
      arrayMerge: (destinationArray, sourceArray) => {
        return [
          ...sourceArray,
          ...destinationArray.filter((d) => {
            return sourceArray.every((s) => {
              return !isEqual(d, s);
            });
          }),
        ];
      },
    });

    // マージされたデータでキャッシュを復元。
    _apolloClient.cache.restore(data);
  }

  // SSGとSSRでは、常に新しいApollo Clientを作成。
  if (typeof window === "undefined") {
    return _apolloClient;
  }

  // クライアントで一度アポロクライアントを作成。
  if (!apolloClient) {
    apolloClient = _apolloClient;
  }

  return _apolloClient;
};

export const addApolloState = (
  client: ApolloClient<NormalizedCacheObject>,
  pageProps: any
) => {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  }
  return pageProps;
};

const useApollo = (pageProps: any) => {
  const state = pageProps[APOLLO_STATE_PROP_NAME];
  const store = useMemo(() => initializeApollo(state), [state]);
  return store;
};

type ProviderProps = {
  pageProps: any;
  children: React.ReactNode;
};

export const ApolloContextProvider: FC<ProviderProps> = (props) => {
  const apolloClient = useApollo(props.pageProps);
  return (
    <ApolloProvider client={apolloClient}>{props.children}</ApolloProvider>
  );
};