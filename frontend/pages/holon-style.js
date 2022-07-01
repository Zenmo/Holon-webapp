import { Fragment } from "react";

import Head from "next/head";
import Button from "../components/Button";
import HolonButton from "../components/HolonButton";
import InputElement from "../components/InputElement";
import EmoticonButton from "../components/EmoticonButton";

export default function HolonStyle() {
  return (
    <Fragment>
      <main className="flex flex-col items-center justify-center py-6">
        <h1 className="mt-6 text-center text-6xl font-semibold lg:text-left">
          Demo of <a href="">holontool.nl</a> styling!
        </h1>
        {/* Start of dark section*/}
        <div className="mt-10 w-full bg-holon-blue-900 p-6 text-white lg:w-8/12 ">
          <span className="m-3 text-lg font-bold">Dark theme</span>

          {/* Start of 1 row */}
          <div className="container flex flex-col items-center gap-3 lg:flex-row">
            <HolonButton variant="darkmode"> this is a dark button </HolonButton>
            <HolonButton variant="darkmode"> cookies of the dark side </HolonButton>
            <EmoticonButton variant="heart" id="love-button"></EmoticonButton>
            <EmoticonButton variant="thumbsup" id="positive-button"></EmoticonButton>
            <EmoticonButton variant="even" id="even-button"></EmoticonButton>
            <EmoticonButton variant="thumbsdown" id="negative-button"></EmoticonButton>
          </div>
          {/* Start of 2 row */}
          <div className="container flex flex-col items-center gap-3 lg:flex-row">
            <HolonButton variant="darkmode">Test</HolonButton>
            <InputElement
              label="email"
              placeholder="j.j.jansen@hetnet.nl"
              id="email"
            ></InputElement>
            <InputElement label="naam" placeholder="Jan Jansen" id="name"></InputElement>

            <InputElement
              label="bedrijf"
              placeholder="Grootschtroom BV"
              id="organisation"
              required={false}
            ></InputElement>
          </div>
        </div>
        {/* Start of dark section*/}
        <div className="mt-10 w-8/12 p-6 lg:w-8/12">
          <span className="m-3 text-lg font-bold">Light theme</span>

          <div className="container flex flex-col items-center gap-3 lg:flex-row">
            <HolonButton variant="gold">Test me like a daddy</HolonButton>
            <HolonButton variant="blue">Hello is you there?</HolonButton>
            <HolonButton variant="darkblue">This is my life</HolonButton>
          </div>
        </div>
      </main>
    </Fragment>
  );
}
