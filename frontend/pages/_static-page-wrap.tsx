import React, { Fragment, useEffect } from "react";
import type { Props } from "@/containers/BasePage/BasePage";
import dynamic from "next/dynamic";
import { NavItem } from "@/api/types";
import { initGA } from "@/utils/gtag";
import { getCookieConsentValue } from "react-cookie-consent";
import Header from "@/components/Header/Header";
import CookieBar from "@/components/CookieBar";
import Head from "next/head";

const WagtailUserbar = dynamic(() => import("@/components/WagtailUserbar"));

export default function StaticPageWrap({
  title,
  children,
  navigation,
  componentProps,
}: {
  title: string;
  children: React.ReactNode;
  navigation: NavItem[];
  componentProps: Props;
}) {
  const { seo = {}, wagtailUserbar }: Props = componentProps;

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
    <Fragment>
      <Head>
        <title>{title}</title>
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
      <div className="BasePage">{children}</div>
      <CookieBar onAccept={initGA} />
      {!!wagtailUserbar && <WagtailUserbar {...wagtailUserbar} />}
    </Fragment>
  );
}
