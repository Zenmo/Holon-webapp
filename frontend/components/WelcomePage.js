import React from "react";
import Image from "next/image";

import HolonButton from "./Buttons/HolonButton";

import quintelLogo from "../public/Logos/quintel_logo.png";
import tnoLogo from "../public/Logos/tno_logo.png";
import wbLogo from "../public/Logos/WB_logo.png";
import zenmoLogo from "../public/Logos/zenmo_logo.png";

export default function WelcomePage() {
  return (
    <div className="flex-col items-start">
      <div className="flex flex-col items-center justify-center">
        <h1 className="mx-6 pb-3 text-center text-6xl font-semibold shadow-golden">Welkom!</h1>
        <p className="mt-8 text-xl">HOLON en de kunst van het loslaten</p>
      </div>
      <div className="mx-16 mt-4 flex flex-wrap justify-center">
        <div className="w-1/2 p-8 pb-0">
          <h2 className="pb-3 text-4xl shadow-golden lg:text-5xl xl:text-6xl">Energietransitie</h2>
          <p className="my-8 w-4/5 text-lg">
            We hebben nu een centraal gestuurd energiesysteem. Dat is aan het veranderen. Hoe ziet
            het energiesysteem van de toekomst eruit?
          </p>
        </div>
        <div className="w-1/2 p-8 pb-0">
          <h2 className="pb-3 text-4xl shadow-blue lg:text-5xl xl:text-6xl">Russisch gas</h2>
          <p className="my-8 w-4/5 text-lg">
            We willen snel een alternatief voor aardgas uit Rusland. Welke mogelijkheden zijn er
            binnen Europa en wat is de rol van Nederland?
          </p>
        </div>
        <div className="w-1/2 p-8 pt-0">
          <HolonButton tag="a" variant="gold" href="#introVideo">
            Vertel me meer!
          </HolonButton>
        </div>
        <div className="w-1/2 p-8 pt-0">
          <HolonButton
            tag="a"
            href="https://gas.holontool.nl/"
            target="_blank"
            rel="noreferrer noopener"
            variant="darkblue"
          >
            Naar de tool
          </HolonButton>
        </div>
      </div>
      <div className="mx-24 my-16 flex h-11 flex-wrap items-center justify-between">
        <div className="w-1/2 px-8 lg:w-1/4">
          <Image alt="Logo Zenmo" src={zenmoLogo} />
        </div>
        <div className="w-1/2 px-8 lg:w-1/4">
          <Image alt="Logo TNO" src={tnoLogo} />
        </div>
        <div className="w-1/2 px-8 lg:w-1/4">
          <Image alt="Logo Witteveen+Bos" src={wbLogo} />
        </div>
        <div className="w-1/2 px-8 lg:w-1/4">
          <Image alt="Logo Quintel" src={quintelLogo} />
        </div>
      </div>
    </div>
  );
}
