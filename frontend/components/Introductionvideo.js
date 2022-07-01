import React from "react";
import Button from "./Button";

function Instructionvideo() {

    return (
        <React.Fragment>
            <div className="relative w-[50%] mb-[2rem]">
            <h2 className="text-3xl">Introductie holarchie</h2>
                <iframe className="w-full aspect-video" title="vimeo-player" src="https://player.vimeo.com/video/371077995?loop=1&amp;byline=0&amp;title=0&amp;dnt=1"></iframe>
                <p className="absolute right-full italic top-[2rem] w-[150px] rotate-[-6deg] mr-[1rem]">
                    In deze korte video leggen we de basis van holarchie aan de hand van praktische voorbeelden uit. <strong>Klik om deze te kijken</strong>
                    <i className="absolute top-full text-[5rem] text-normal  right-[1rem] leading-[5rem] not-italic">⤷</i>
                </p>
            </div>
            <h3 className="text-2xl italic mb-[2rem]">Hebben we je interesse?</h3>
            <div className="flex gap-[1rem]">
                <Button variant="holon__ghost">Aan de gang</Button>
                <Button variant="holon__ghost">Hou me op de hoogte</Button>
            </div>


        </React.Fragment>
    );
}

export default Instructionvideo;