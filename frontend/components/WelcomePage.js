import { Fragment } from "react";
import PropTypes from "prop-types";

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

/**
 * Creates a flexible content or button block.
 */
function Block({ children, className = "", flexOrder, mobileFlexOrder = flexOrder }) {
  return (
    <div
      className={`order-${mobileFlexOrder} w-full px-8 text-center sm:order-${flexOrder} sm:w-1/2 sm:text-left ${className}`.trim()}
    >
      {children}
    </div>
  );
}

Block.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  flexOrder: PropTypes.number.isRequired,
  mobileFlexOrder: PropTypes.number,
};

/**
 * Content which contains a header and an description paragraph.
 */
function ContentColumn({ shadowColor = "golden", header, children }) {
  return (
    <Fragment>
      <h2 className={`pb-3 text-4xl shadow-${shadowColor} lg:text-5xl xl:text-6xl`}>{header}</h2>
      <p className="my-8 text-base sm:w-4/5 lg:text-lg">{children}</p>
    </Fragment>
  );
}

ContentColumn.propTypes = {
  header: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  shadowColor: PropTypes.oneOf(["blue", "golden"]),
};

export default function WelcomePage() {
  return (
    <div className="pt-8 pb-48">
      <div className="mx-4 flex flex-wrap items-start lg:mx-24">
        <div className="order-1 flex w-full flex-col items-center justify-center pb-16">
          <h1 className="mx-6 pb-3 text-center text-6xl font-semibold shadow-golden">Welkom!</h1>
          <p className="mt-8 text-xl">HOLON en de kunst van het loslaten</p>
        </div>
        <Block flexOrder={2}>
          <ContentColumn header="Energietransitie">
            We hebben nu een centraal gestuurd energiesysteem. Holontool.nl geeft inzicht in hoe we
            kunnen overstappen op een systeem met meer lokale autonomie dat optimaal ruimte biedt
            aan duurzame energie.
          </ContentColumn>
        </Block>
        <Block flexOrder={3} mobileFlexOrder={4} className="pt-16 sm:pt-0">
          <ContentColumn header="Russisch gas" shadowColor="blue">
            We willen snel een alternatief voor aardgas uit Rusland. Welke mogelijkheden zijn er
            binnen Europa en wat is de rol van Nederland?
          </ContentColumn>
        </Block>
        <Block flexOrder={4} mobileFlexOrder={3} className="mt-0">
          <HolonButton
            tag="a"
            variant="gold"
            href="#introVideo"
            className="mx-auto text-base md:mx-0"
          >
            Vertel me meer!
          </HolonButton>
        </Block>
        <Block flexOrder={5} className="mt-0">
          <HolonButton
            tag="a"
            href="https://gas.holontool.nl/"
            target="_blank"
            rel="noreferrer noopener"
            variant="darkblue"
            className="mx-auto text-base md:mx-0"
          >
            Meer over Russisch gas
          </HolonButton>
        </Block>
      </div>
      <SponsorLogos />
    </div>
  );
}
