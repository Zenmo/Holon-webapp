import React from "react";
import HolonButton from "./Buttons/HolonButton";

export default function IntroductionVideo() {
  return (
    <div className="bg-holon-blue-900 py-4 text-white">
      <div className="mx-auto max-w-[600px]">
        <div className="relative mb-[2rem]">
          <h2 className="text-3xl">Introductie holarchie</h2>
          <iframe
            className="aspect-video w-full"
            title="vimeo-player"
            src="https://player.vimeo.com/video/371077995?loop=1&amp;byline=0&amp;title=0&amp;dnt=1"
          ></iframe>
          <p className="absolute right-full top-[2rem] mr-[1rem] w-[200px] rotate-[-6deg] text-lg italic">
            In deze korte video leggen we de basis van holarchie aan de hand van praktische
            voorbeelden uit. <strong>Klik om deze te kijken</strong>
            <i className="text-normal absolute top-full right-[1rem]  text-[5rem] not-italic leading-[5rem]">
              ⤷
            </i>
          </p>
        </div>
        <h3 className="mb-[2rem] text-center text-2xl italic">Hebben we je interesse?</h3>
        <div className="flex gap-[1rem]">
          <HolonButton variant="darkmode">Aan de gang</HolonButton>
          <HolonButton variant="darkmode">Hou me op de hoogte</HolonButton>
        </div>
      </div>
    </div>
  );
}
