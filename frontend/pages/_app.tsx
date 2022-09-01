import React,{Fragment, useEffect } from "react";
import PropTypes from "prop-types";

import { useRouter } from "next/router";

import { getCookieConsentValue } from "react-cookie-consent";
import { initGA } from "../util/gtag";
import CookieBar from "../components/CookieBar";

import "../styles/globals.css";
import "../styles/prism-ghcolors.css";

import "@fontsource/inter/variable.css";

import WikiLayout from "./_wiki";

/**
 * Wraps /docs pages in the DocsLayout component. Other pages are rendered without changes.
 */
function WrapperComponent({ children }) {
  const router = useRouter();

  if (router.pathname.startsWith("/wiki")) {
    return <WikiLayout>{children}</WikiLayout>;
  }

  return <>{children}</>;
}

WrapperComponent.propTypes = {
  children: PropTypes.node.isRequired,
};

function MyApp<T extends React.ElementType>({
  Component,
  pageProps,
}: {
  Component: T;
  pageProps: React.ComponentProps<T>;
}) {
  useEffect(() => {
    getCookieConsentValue() === "true" && initGA();
  }, []);

  return (
    <Fragment>
      <WrapperComponent>
        <Component {...pageProps} />
      </WrapperComponent>
      <CookieBar onAccept={initGA} />
    </Fragment>
  );
}

export default MyApp;

MyApp.propTypes = {
  Component: PropTypes.func,
  pageProps: PropTypes.object,
};