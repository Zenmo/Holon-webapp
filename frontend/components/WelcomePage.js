import React from 'react';
import Link from 'next/link'; 

import HolonButton from './Buttons/HolonButton';  

export default function WelcomePage() {
    return (
        <div className="flex-col items-start">
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-center text-6xl font-semibold underline decoration-holon-gold-200 decoration-[16px] underline-offset-[-2px]">Welkom!</h1>
                <p className="mt-8 text-lg">HOLON en de kunst van het Loslaten</p>
            </div>
            <div className="mt-4 flex justify-center">
                <div className="m-8 w-1/3">
                    <h2 className="text-6xl underline decoration-holon-gold-200 decoration-[16px] underline-offset-8">Energietransitie</h2>
                    <p className="my-8 w-4/5">Hiërarchie en anarchie zijn de uitersten. Ergens in het midden ligt een oplossing die het beste van beide samenbrengt tot een gebalanceerd systeem. </p>
                    <Link href="#introVideo"><HolonButton variant="gold">Vertel me meer!</HolonButton></Link>
                </div>
                <div className="m-8 w-1/3">
                    <h2 className="text-6xl underline decoration-holon-slated-blue-300 decoration-[16px] underline-offset-8">Russisch gas</h2>
                    <p className="my-8 w-4/5">De oorlog in Oekraïne drukt ons met de neus op de feiten. We worden geconfronteerd met onze energieafhankelijkheid van een agressor.</p>
                    <a href="https://holon-gas.netlify.app/" target="_blank"><HolonButton variant="darkblue">Naar de tool</HolonButton></a>
                </div>
            </div>
            <div className="mx-24 my-16 h-11 flex justify-between">
                <img src="/Logos/zenmo_logo.png" ></img>
                <img src="/Logos/tno_logo.png" ></img>
                <img src="/Logos/WB_logo.png" ></img>
                <img src="/Logos/quintel_logo.png" ></img>
            </div>
        </div>
       


    )
}