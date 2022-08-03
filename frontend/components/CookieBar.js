import { useEffect } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import CookieConsent, { getCookieConsentValue, Cookies } from "react-cookie-consent";

import cookieImg from "../public/imgs/cookie.png";

function CookieBar({ onAccept }) {
  return (
    <CookieConsent
      location="bottom"
      buttonText="accepteren"
      enableDeclineButton="true"
      declineButtonText="weigeren"
      disableStyles={true}
      containerClasses="bg-white flex flex-col xl:flex-row items-center xl:items-baseline justify-center fixed w-4/5 mx-[10%] mb-[7%] border border-black rounded shadow-holon-blue pb-4 z-[100]"
      buttonClasses="text-white bg-holon-blue-500 border-holon-blue-900 shadow-holon-blue hover:bg-holon-blue-900 active:shadow-holon-blue-hover relative m-2 w-40 xl:w-52 rounded-md border-2 p-3 text-center font-medium leading-5 transition enabled:active:translate-x-holon-bh-x enabled:active:translate-y-holon-bh-y"
      declineButtonClasses="bg-holon-gold-200 border-holon-blue-900 shadow-holon-blue hover:bg-holon-gold-600 active:shadow-holon-blue-hover relative m-2 w-40 xl:w-52 rounded-md border-2 p-3 text-center font-medium leading-5 transition enabled:active:translate-x-holon-bh-x enabled:active:translate-y-holon-bh-y"
      onAccept={onAccept}
    >
      <div className="relative flex items-center justify-center">
        <Image alt="cookie image" src={cookieImg} width={245} height={100} />
      </div>
      <div>
        Deze website maakt gebruik van cookies. Lees{" "}
        <a
          className="inline underline"
          href="/cookie-policy"
          target="_blank"
          rel="noreferrer noopener"
        >
          hier
        </a>{" "}
        onze cookie policy.
      </div>
    </CookieConsent>
  );
}

export default CookieBar;

CookieBar.propTypes = {
  onAccept: PropTypes.func,
};
