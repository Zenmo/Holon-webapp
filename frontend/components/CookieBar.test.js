import { render, screen } from "@testing-library/react";

import CookieConsent, { getCookieConsentValue, Cookies } from "react-cookie-consent";
import { initGA } from "../util/gtag";
import CookieBar from "./CookieBar";

describe("Cookiebar", () => {
  it("is rendered", () => {
    render(<CookieBar></CookieBar>);
    expect(ReactGA.testModeAPI.calls).toEqual([
      ["create", "G-EHMXV36KJV", "auto"],
      ["send", "pageview", "/mypage"],
    ]);
  });
});
