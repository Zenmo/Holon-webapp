import { useState, useEffect } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";

import { initGA } from "@/utils/gtag";
import { getCookieConsentValue } from "react-cookie-consent";
import CookieBar from "@/components/CookieBar";
import Header from "@/components/Header/Header";
import { NavItem } from "@/api/types";

const WagtailUserbar = dynamic(() => import("@/components/WagtailUserbar"));

type Props = React.PropsWithChildren<{
  navigation: NavItem[];
  seo?: {
    canonicalLink?: string;
    seoHtmlTitle?: string;
    seoMetaDescription?: string;
    seoMetaRobots?: string;
    seoOgDescription?: string;
    seoOgImage?: string;
    seoOgTitle?: string;
    seoOgType?: string;
    seoOgUrl?: string;
    seoTwitterDescription?: string;
    seoTwitterImage?: string;
    seoTwitterTitle?: string;
    seoTwitterUrl?: string;
  };

  wagtailUserbar?: {
    html: string;
  };
}>;

const BasePage = ({ children, navigation, seo = {}, wagtailUserbar }: Props) => {
  const {
    seoHtmlTitle,
    seoMetaDescription,
    seoOgTitle,
    seoOgDescription,
    seoOgUrl,
    seoOgImage,
    seoOgType,
    seoTwitterTitle,
    seoTwitterDescription,
    seoTwitterUrl,
    seoTwitterImage,
    seoMetaRobots,
    canonicalLink,
  } = seo;
  const [status, setStatus] = useState("register");
  const [nameUser, setNameUser] = useState("");

  useEffect(() => {
    getCookieConsentValue() === "true" && initGA();
  }, []);

  return (
    <>
      <Head>
        <title>{seoHtmlTitle}</title>
        <link rel="icon" href="/favicon.ico" />
        {!!seoMetaDescription && <meta name="description" content={seoMetaDescription} />}
        {!!seoOgTitle && <meta property="og:title" content={seoOgTitle} />}
        {!!seoOgDescription && <meta property="og:description" content={seoOgDescription} />}
        {!!seoOgUrl && <meta property="og:url" content={seoOgUrl} />}
        {!!seoOgImage && <meta property="og:image" content={seoOgImage} />}
        {!!seoOgType && <meta property="og:type" content={seoOgType} />}
        {!!seoTwitterTitle && <meta property="twitter:title" content={seoTwitterTitle} />}
        {!!seoTwitterDescription && (
          <meta property="twitter:description" content={seoTwitterDescription} />
        )}
        {!!seoTwitterUrl && <meta property="twitter:url" content={seoTwitterUrl} />}
        {!!seoTwitterImage && <meta property="twitter:image" content={seoTwitterImage} />}
        <meta name="robots" content={seoMetaRobots} />
        {!!canonicalLink && <link rel="canonical" href={canonicalLink} />}
      </Head>
      <Header navigation={navigation} status={status} nameUser={nameUser} />
      <div className="BasePage">{children}</div>
      <CookieBar onAccept={initGA} />
      {!!wagtailUserbar && <WagtailUserbar {...wagtailUserbar} />}
    </>
  );
};

export default BasePage;
