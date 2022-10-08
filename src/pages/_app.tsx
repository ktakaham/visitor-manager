import "../styles/globals.css";

import type { AppProps } from "next/app";
import { ApolloContextProvider } from "@/utils/apollo/apolloClient";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ApolloContextProvider pageProps={pageProps}>
      <Component {...pageProps} />
    </ApolloContextProvider>
  );
};

export default App;
