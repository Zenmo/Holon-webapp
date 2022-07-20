import CookieConsent from "react-cookie-consent";
import Image from "next/image";
import Holonbutton from "../components/Buttons/HolonButton";

import cookieImg from "../public/imgs/cookie.png";

function CookieBar() {
  return (
    <CookieConsent
      location="bottom"
      buttonText="accepteren"
      enableDeclineButton="true"
      declineButtonText="weigeren"
      style={{
        background: "white",
        height: "10rem",
        width: "80%",
        color: "black",
        margin: "0 10% 7% 10%",
        border: "1px solid black",
        borderRadius: "5px",
      }}
      buttonStyle={{
        color: "white",
        backgroundColor: "#23549F",
        width: "18rem",
        border: "1px solid #051E3F",
        borderRadius: "5px",
      }}
      declineButtonStyle={{
        backgroundColor: "white",
        color: "black",
        width: "18rem",
        border: "1px solid #051E3F",
        borderRadius: "5px",
      }}
    >
      <div className="w-72">
        <Image alt="cookie image" src={cookieImg} height={60} width={145} />
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
