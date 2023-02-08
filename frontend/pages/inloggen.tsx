import { useEffect } from "react";
import Head from "next/head";
import type { Props } from "@/containers/BasePage/BasePage";
import dynamic from "next/dynamic";
import { getPage } from "../api/wagtail";

import { initGA } from "@/utils/gtag";
import { getCookieConsentValue } from "react-cookie-consent";
import CookieBar from "@/components/CookieBar";
import Header from "@/components/Header/Header";

import LoginForm from "@/components/Login";

const WagtailUserbar = dynamic(() => import("@/components/WagtailUserbar"));

export default function LoginPage({
  componentName,
  componentProps,
}: {
  componentName: string;
  componentProps: Props;
}) {
  const { seo = {}, navigation, wagtailUserbar }: Props = componentProps;

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

  useEffect(() => {
    getCookieConsentValue() === "true" && initGA();
  }, []);

  return (
    <>
      <Head>
        <title>Inloggen</title>
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
      <Header navigation={navigation} />
      <div className="BasePage">
        <LoginForm />
      </div>
      <CookieBar onAccept={initGA} />
      {!!wagtailUserbar && <WagtailUserbar {...wagtailUserbar} />}
    </>
  );
}

export async function getStaticProps({ params, preview, previewData }) {
  params = params || {};
  let path = params.path || [];
  path = path.join("/");

  const { json: pageData } = await getPage(path);
  return { props: pageData };
}
