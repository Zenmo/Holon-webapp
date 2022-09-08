import React from "react";
import HolonButton from "../Buttons/HolonButton";

export default function IntroductionVideo() {
  return (
    <div className="min-h-screen bg-holon-blue-900 text-white">
      <div className="mx-auto w-[80%] max-w-[600px]">
        <div className="relative mb-8">
          <h1 className="mb-3 pt-32 text-2xl font-bold sm:text-3xl lg:text-4xl">
            Introductie holontool.nl
          </h1>
          <p className="mr-4 mb-2 text-lg italic xl:absolute xl:right-full xl:top-48 xl:w-[200px] xl:rotate-[-6deg]">
            Wij zoeken beleidsmakers geinteresseerd in lokale autonomie. Deze video licht het toe.
            <i className="text-normal absolute top-full right-4 hidden text-[5rem]  not-italic leading-[5rem] xl:inline">
              ⤷
            </i>
          </p>
          <iframe
            data-testid="introductionvideo"
            className="aspect-video h-full w-full max-w-full border-2 border-white"
            title="vimeo-player"
            src="https://player.vimeo.com/video/727346453?&amp;byline=0&amp;title=0&amp;dnt=1"
          ></iframe>
        </div>
        <h3 className="mb-8 text-center text-2xl italic">Wil je meedoen?</h3>
        <div className="flex flex-col items-center gap-4 sm:flex-row">
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
