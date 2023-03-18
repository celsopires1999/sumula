import { Layout } from "@/frontend/src/components/Layout";
import { useAppTheme } from "@/frontend/src/hooks/useAppTheme";
import { CacheProvider, EmotionCache } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { AppProps } from "next/app";
import Head from "next/head";
import createEmotionCache from "../frontend/src/utils/createEmotionCache";
import { Provider } from "react-redux";
import { setupStore } from "../frontend/src/app-store/store";
import { SnackbarProvider } from "notistack";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const [currentTheme, toggleCurrentTheme] = useAppTheme();
  const store = setupStore();

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Provider store={store}>
        <ThemeProvider theme={currentTheme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Layout toggle={toggleCurrentTheme} currentTheme={currentTheme}>
            <SnackbarProvider
              autoHideDuration={2000}
              maxSnack={3}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Component {...pageProps} />
            </SnackbarProvider>
          </Layout>
        </ThemeProvider>
      </Provider>
    </CacheProvider>
  );
}
