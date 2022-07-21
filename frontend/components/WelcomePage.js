import Image from "next/image";

import HolonButton from "./Buttons/HolonButton";

import quintelLogo from "../public/Logos/quintel_logo.png";
import tnoLogo from "../public/Logos/tno_logo.png";
import wbLogo from "../public/Logos/WB_logo.png";
import zenmoLogo from "../public/Logos/zenmo_logo.png";

function SponsorLogos() {
  return (
    <div className="absolute bottom-0 left-0 right-0 pb-6">
      <div className="mx-auto flex max-w-sm flex-wrap items-center justify-center sm:max-w-3xl">
        <div className="w-1/2 px-6 sm:w-1/4">
          <Image alt="Logo Zenmo" src={zenmoLogo} />
        </div>
        <div className="w-1/2 px-6 sm:w-1/4">
          <Image alt="Logo TNO" src={tnoLogo} />
        </div>
        <div className="w-1/2 px-6 sm:w-1/4">
          <Image alt="Logo Witteveen+Bos" src={wbLogo} />
        </div>
        <div className="w-1/2 px-6 sm:w-1/4">
          <Image alt="Logo Quintel" src={quintelLogo} />
        </div>
      </div>
    </div>
  );
}
export default function WelcomePage() {
  return (
    <div className="pt-8 pb-48">
      <div className="mx-4 flex flex-wrap items-start lg:mx-24">
        <div className="flex w-full flex-col items-center justify-center pb-16">
          <h1 className="mx-6 pb-3 text-center text-6xl font-semibold shadow-golden">Welkom!</h1>
          <p className="mt-8 text-xl">HOLON en de kunst van het loslaten</p>
        </div>
        <div className="mx-auto w-full px-8 text-center sm:w-1/2">
          <h2 className="inline-block pb-3 text-4xl shadow-golden lg:text-5xl xl:text-6xl">
            Energietransitie
          </h2>
          <p className="my-8 text-base lg:text-lg">
            We hebben nu een centraal gestuurd energiesysteem. Holontool.nl geeft inzicht in hoe we
            kunnen overstappen op een systeem met meer lokale autonomie dat optimaal ruimte biedt
            aan duurzame energie.
          </p>
          <HolonButton tag="a" variant="gold" href="#introVideo" className="mx-auto text-base">
            Vertel me meer!
          </HolonButton>
        </div>
      </div>
      <SponsorLogos />
    </div>
  );
}
