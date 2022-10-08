import "../styles/globals.css";

import type { AppProps } from "next/app";
import { ApolloContextProvider } from "@/utils/apollo/apolloClient";
import type { EmotionCache } from "@emotion/react";
import { CacheProvider } from "@emotion/react";
import { createEmotionCache } from "@/utils/mui/createEmotionCache";

const clientSideEmotionCache = createEmotionCache();

interface AppPropsExtend extends AppProps {
  emotionCache?: EmotionCache;
}

const App = ({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: AppPropsExtend) => {
  return (
    <ApolloContextProvider pageProps={pageProps}>
      <CacheProvider value={emotionCache}>
        <Component {...pageProps} />
      </CacheProvider>
    </ApolloContextProvider>
  );
};

export default App;
