import React from "react";
import HolonButton from "../Buttons/HolonButton";

export default function IntroductionVideo() {
  return (
    <div className="min-h-screen bg-holon-blue-900 text-white">
      <div className="mx-auto max-w-[600px]">
        <div className="relative mb-8">
          <h2 className="mb-3 pt-32 text-3xl font-bold">Introductie holontool.nl</h2>
          <iframe
            data-testid="introductionvideo"
            className="aspect-video w-full border-2 border-white"
            title="vimeo-player"
            src="https://player.vimeo.com/video/727346453?&amp;byline=0&amp;title=0&amp;dnt=1"
          ></iframe>
          <p className="absolute right-full top-48 mr-4 w-[200px] rotate-[-6deg] text-lg italic">
            Wij zoeken beleidsmakers geinteresseerd in lokale autonomie. Deze video licht het toe.
            <i className="text-normal absolute top-full right-4  text-[5rem] not-italic leading-[5rem]">
              ⤷
            </i>
          </p>
        </div>
        <h3 className="mb-8 text-center text-2xl italic">Wil je meedoen?</h3>
        <div className="flex gap-4">
          <HolonButton tag="a" href="#start" variant="darkmode">
            Naar de demo
          </HolonButton>
          <HolonButton
            tag="a"
            href="https://nl.surveymonkey.com/r/RYK7SRL"
            variant="darkmode"
            target="_blank"
          >
            Naar de enquête
          </HolonButton>
        </div>
      </div>
    </div>
  );
}
