import { reactPlugin } from "@/utils/appInsightsHistory";
import { AppInsightsContext } from "@microsoft/applicationinsights-react-js";
import "../index.css";

function MyApp({ Component, pageProps }) {
  return (
    <AppInsightsContext.Provider value={reactPlugin}>
      <Component {...pageProps} />
    </AppInsightsContext.Provider>
  );
}

export default MyApp;