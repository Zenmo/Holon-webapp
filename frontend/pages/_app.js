import PropTypes from "prop-types";
import "../styles/globals.css";
import "@fontsource/inter/variable.css";

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;

MyApp.propTypes = {
  Component: PropTypes.object,
  pageProps: PropTypes.object,
};
