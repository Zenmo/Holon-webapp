import CookieConsent from "react-cookie-consent"
export default function CookieBar({ onAccept }: { onAccept: () => void }) {
    return (
        <CookieConsent
            location="bottom"
            buttonText="accepteren"
            enableDeclineButton
            declineButtonText="weigeren"
            disableStyles={true}
            containerClasses="bg-white flex flex-col xl:flex-row items-center xl:items-baseline justify-center fixed w-4/5 mx-[10%] mb-[7%] border border-black rounded shadow-holon-blue pb-4 z-50"
            buttonClasses="ml-[25%] lg:ml-2 text-white bg-holon-blue-500 border-holon-blue-900 shadow-holon-blue hover:bg-holon-blue-900 active:shadow-holon-blue-hover relative m-2 w-40 xl:w-52 rounded-md border-2 p-3 text-center font-medium leading-5 transition enabled:active:translate-x-holon-bh-x enabled:active:translate-y-holon-bh-y"
            declineButtonClasses="ml-[25%] lg:ml-2 bg-holon-gold-200 border-holon-blue-900 shadow-holon-blue hover:bg-holon-gold-600 active:shadow-holon-blue-hover relative m-2 w-40 xl:w-52 rounded-md border-2 p-3 text-center font-medium leading-5 transition enabled:active:translate-x-holon-bh-x enabled:active:translate-y-holon-bh-y"
            onAccept={onAccept}
        >
            <div className="relative flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="cookie image" src="/imgs/cookie.png" width={245} height={100} />
            </div>
            <div className="mx-1">
                Bij het accepteren wordt Azure Application Insights ingeschakeld.
            </div>
        </CookieConsent>
    )
}
