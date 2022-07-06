import React, { useState, useEffect } from "react";
import Button from "../components/Buttons/Button";
import ScenarioSlider from "./Scenarios/Scenarioslider";
import Scenarioresults from "./Scenarios/Scenariosresults";
import Scenarioswitch from "./Scenarios/Scenarioswitch";
import HolonButton from "../components/Buttons/HolonButton";
import Loader from "./Scenarios/Loader";

function Scenarios(props) {

    const [loading, setLoading] = useState(false);

    const [uncalculatedScenario, setUncalculatedScenario] = useState(false);


    const [heatpump, setHeatpump] = useState(0);
    const [evadoptation, setEvadoptation] = useState(0);
    const [solarpanels, setSolarpanels] = useState(0);
    const [heatnetwork, setHeatnetwork] = useState(false);

    const [cooporation, setCooperation] = useState('');

    const [legal, setLegal] = useState('');

    const [local, setLocal] = useState(true);

    const [reliability, setReliability] = useState(0);
    const [energyconsumption, setEnergyconsumption] = useState(0);
    const [affordability, setAffordability] = useState(0);
    const [selfsufficient, setSelfsufficient] = useState(0);

    useEffect(() => {
        setUncalculatedScenario(true)
    }, [heatpump, evadoptation, solarpanels, cooporation, heatnetwork, legal]);

    useEffect(() => {
        props.heatpump && setHeatpump(props.heatpump)
        props.evadoptation && setEvadoptation(props.evadoptation)
        props.solarpanels && setSolarpanels(props.solarpanels)
        props.heatnetwork && setHeatnetwork(props.heatnetwork)

        props.cooporation && setCooperation(props.cooporation)
        props.legal && setLegal(props.legal)

        props.locked && triggercalculate()
    }, []);

    async function triggercalculate(e) {
        if (e) {
            e.preventDefault()
            e.stopPropagation()
        }

        setLoading(true)

        const timer = setTimeout(() => {
            setLoading(false);
            setUncalculatedScenario(false);

            setReliability({ national: Math.floor(Math.random() * 100), local: Math.floor(Math.random() * 100) });
            setEnergyconsumption({ national: Math.floor(Math.random() * 10000), local: Math.floor(Math.random() * 10000) });
            setAffordability({ national: Math.floor(Math.random() * 10000), local: Math.floor(Math.random() * 10000) });
            setSelfsufficient({ national: Math.floor(Math.random() * 100), local: Math.floor(Math.random() * 100) });
        }, 5000);



        return () => clearTimeout(timer);
    }

    return (
        <React.Fragment>
            <div className="container mx-auto">
                <div className={props.locked ? 'border-8 border-cyan-500 p-2' : 'p-2 border-transparent border-8'}>
                    <h2 className="text-2xl">Twee keer slimmer</h2>
                    <div className="flex flex-col md:flex-row">
                        <div className="basis-full md:basis-1/3 pr-4">
                            <form className="" >
                                <h3 className="text-xl mb-4" >Instellingen</h3>
                                <fieldset disabled={props.locked} className={props.locked && `cursor-not-allowed`}>
                                    <div className={props.locked && `pointer-events-none`}>
                                        <ScenarioSlider disabled={props.locked} inputid="heatpump" value={heatpump} updatevalue={setHeatpump} />
                                        <ScenarioSlider disabled={props.locked} inputid="evadoptation" value={evadoptation} updatevalue={setEvadoptation} />
                                        <ScenarioSlider disabled={props.locked} inputid="solarpanels" value={solarpanels} updatevalue={setSolarpanels} />

                                        <Scenarioswitch disabled={props.locked} off="nee" on="ja" label="Warmtenetwerk" inputid="heatnetwork" value={heatnetwork} updatevalue={setHeatnetwork} />
                                        <div className="flex flex-row basis-full mb-2  mt-2">
                                            <select disabled={props.locked} className="border rounded-lg shadow-[4px_4px_0_0] text-holon-blue-900 w-full p-2 disabled:bg-slate-50 disabled:text-slate-500" onChange={(e) => setCooperation(e.target.value)} value={cooporation}>
                                                <option value="">Maak keuze</option>
                                                <option value="optie 1">Optie 1</option>
                                                <option value="optie 2">Optie 2</option>
                                                <option value="optie 3">Optie 3</option>
                                            </select>
                                        </div>

                                        <h5 className="text-lg">Juridisch</h5>
                                        <div className="flex flex-col">

                                            <label htmlFor="scenariolegal1" className="flex flex-row items-center gap-2 mb-2">
                                                <input type="radio" name="scenariolegal" id="scenariolegal1" value="legal 1" onChange={(e) => setLegal(e.target.value)} checked={legal === 'legal 1'} />
                                                <span>Waarde 1</span>
                                            </label>
                                            <label htmlFor="scenariolegal2" className="flex flex-row items-center gap-2 mb-2">
                                                <input type="radio" name="scenariolegal" id="scenariolegal2" value="legal 2" onChange={(e) => setLegal(e.target.value)} checked={legal === 'legal 2'} />
                                                <span>value 2</span>
                                            </label>
                                            <label htmlFor="scenariolegal3" className="flex flex-row items-center gap-2 mb-2">
                                                <input type="radio" name="scenariolegal" id="scenariolegal3" value="legal 3" onChange={(e) => setLegal(e.target.value)} checked={legal === 'legal 3'} />
                                                <span>value 3</span>
                                            </label>
                                        </div>
                                    </div>
                                </fieldset>

                            </form>

                        </div>
                        <div className="w-[4px] bg-slate-300"></div>
                        <div className="basis-full md:basis-2/3 pl-4">
                            <Scenarioresults
                                reliability={reliability}
                                energyconsumption={energyconsumption}
                                affordability={affordability}
                                selfsufficient={selfsufficient}
                                local={local}
                                setLocal={setLocal}
                            >
                                {props.locked && loading &&
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                                        <Loader />
                                    </div>
                                }
                                {!props.locked &&
                                    <React.Fragment>
                                        {(uncalculatedScenario == true || loading) &&
                                            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                                                {loading ? <Loader /> : (
                                                    <HolonButton variant="darkblue" onClick={(e) => triggercalculate(e)}>Herbereken</HolonButton>
                                                )}
                                            </div>
                                        }
                                    </React.Fragment>
                                }

                            </Scenarioresults>

                        </div>

                    </div>
                </div>
            </div >

        </React.Fragment >
    );
}

export default Scenarios;