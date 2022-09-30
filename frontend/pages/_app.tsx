import React, { Fragment, useEffect } from "react";

import { useRouter } from "next/router";

import { getCookieConsentValue } from "react-cookie-consent";
import { initGA } from "../util/gtag";
import CookieBar from "../components/CookieBar";

import "../styles/globals.css";
import "../styles/prism-ghcolors.css";

import "@fontsource/inter/variable.css";

import "../styles/interactive-image.css";

import WikiLayout from "./_wiki";

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

  const router = useRouter();

  return (
    <Fragment>
      {router.pathname.startsWith("/wiki") ? (
        <WikiLayout>
          <Component {...pageProps} />
        </WikiLayout>
      ) : (
        <Component {...pageProps} />
      )}
      <CookieBar onAccept={initGA} />
    </Fragment>
  );
}

export default MyApp;
