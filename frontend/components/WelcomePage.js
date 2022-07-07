import React from 'react';
import Link from 'next/link';

import HolonButton from './Buttons/HolonButton';

export default function WelcomePage() {
    return (
        <div className="flex-col items-start">
            <div className="flex flex-col items-center justify-center">
                <h1 className="mx-6 pb-3 text-center text-6xl font-semibold shadow-golden">Welkom!</h1>
                <p className="mt-8 text-lg">HOLON en de kunst van het Loslaten</p>
            </div>
            <div className="mt-4 flex justify-center">
                <div className="m-8 w-1/3">
                    <h2 className="pb-3 text-6xl shadow-golden">Energietransitie</h2>
                    <p className="my-8 w-4/5">We hebben nu een centraal gestuurd energiesysteem. Dat is aan het veranderen. Hoe ziet het energiesysteem van de toekomst eruit?</p>
                    <HolonButton tag="a" variant="gold" href="#introVideo">Vertel me meer!</HolonButton>
                </div>
                <div className="m-8 w-1/3">
                    <h2 className="pb-3 text-6xl shadow-blue">Russisch gas</h2>
                    <p className="my-8 w-4/5">We willen snel een alternatief voor aardgas uit Rusland. Welke mogelijkheden zijn er binnen Europa en wat is de rol van Nederland?</p>
                    <HolonButton tag="a" href="https://holon-gas.netlify.app/" target="_blank" variant="darkblue">Naar de tool</HolonButton>
                </div>
            </div>
            <div className="mx-24 my-16 h-11 flex justify-between">
                <img alt="Logo Zenmo" src="/Logos/zenmo_logo.png" ></img>
                <img alt="Logo TNO" src="/Logos/tno_logo.png" ></img>
                <img alt="Logo Witteveen+Bos" src="/Logos/WB_logo.png" ></img>
                <img alt="Logo Quintel" src="/Logos/quintel_logo.png" ></img>
            </div>
        </div>



    )
}