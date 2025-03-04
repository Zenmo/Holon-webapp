import ChallengeFeedbackModal from "@/components/Blocks/ChallengeFeedbackModal/ChallengeFeedbackModal"
import Button from "@/components/Button/Button"
import { StaticImage } from "@/components/ImageSelector/types"
import KPIDashboard from "@/components/KPIDashboard/KPIDashboard"
import { Graphcolor, SectionVariant } from "@/containers/types"
import { ScenarioContext } from "context/ScenarioContext"
import { debounce } from "lodash"
import React, { useContext, useEffect, useMemo, useRef, useState } from "react"
import { getGridCss } from "services/grid"
import { InteractiveElement } from "../../../api/holon"
import { WikiLink } from "../../../containers/types"
import { HolarchyFeedbackImageProps } from "../HolarchyFeedbackImage/HolarchyFeedbackImage"
import ContentColumn from "./ContentColumn"
import CostBenefitModal from "./CostBenefitModal/CostBenefitModal"
import HolarchyTab from "./HolarchyTab/HolarchyTab"
import { LegendItem } from "./HolarchyTab/LegendModal"
import ScenarioModal from "./ScenarioModals/ScenarioModal"
import { Content, InteractiveContent, SavedElements } from "./types"
import { useSimulation } from "@/services/use-simulation"
import {
    AnyLogicOutputCondition,
    DatamodelQueryCondition,
    FeedbackModal,
} from "@/components/Blocks/ChallengeFeedbackModal/types"
import { ShareButton } from "@/components/Button/ShareButton"
import {TwoColumnSimulationLayoutTwo} from "@/components/Blocks/SectionBlock/TwoColumn"

type Props = {
    data: SectionVariant
    pagetype?: string
    pagetitle?: string
    feedbackmodals: FeedbackModal[]
    graphcolors?: Graphcolor[]
    savePageValues: React.Dispatch<React.SetStateAction<SavedElements>>
    saveScenario: (title: string, description: string, sectionId: string) => string
    scenarioDiffElements: object

    wikilinks?: WikiLink[]
}

export default function SectionBlock({
    data,
    wikilinks,
    pagetype,
    feedbackmodals,
    graphcolors,
    savePageValues,
    saveScenario,
    scenarioDiffElements,
    pagetitle,
}: Props) {
    const { simulationState, calculateKPIs, setDirty } = useSimulation()
    const {
        simulationResult: {
            dashboardResults: kpis,
            costBenefitResults: costBenefitData,
            datamodelQueryResults,
            anylogicOutputs,
        },
        loadingState,
    } = simulationState

    const loading = loadingState === "SENT" || loadingState === "SIMULATING"
    const isInitialLoad = loadingState === "INITIAL"
    const [content, setContent] = useState<Content[]>([])
    const [initialContent, setInitialContent] = useState<Content[]>([])
    const [holarchyFeedbackImages, setHolarchyFeedbackImages] = useState<
        HolarchyFeedbackImageProps[]
    >([])
    const [legendItems, setLegendItems] = useState([])
    const [media, setMedia] = useState<StaticImage>({})
    const [costBenefitModal, setCostBenefitModal] = useState<boolean>(false)
    const [holarchyModal, setHolarchyModal] = useState<boolean>(false)
    const [savedScenarioURL, setSavedScenarioURL] = useState<string>("")
    const [showScenarioModal, setShowScenarioModal] = useState<boolean>(false)
    const [scenarioModalType, setScenarioModalType] = useState<
        "saveScenario" | "savedScenario" | "openScenario"
    >("saveScenario")

    const scenario = useContext<number>(ScenarioContext)
    const [dirtyState, setDirtyState] = useState<boolean>(false)
    const [resetState, setResetState] = useState<boolean>(false)

    const sectionContainerRef = useRef(null)

    const backgroundFullcolor =
        data.value?.background.size == "bg__full" ? data.value.background.color : ""

    // Have to create a seperate variable for this since the bg-color is semi-transparent
    // Otherwise they will overlap and will the left be darker since 2 layers
    const backgroundLeftColor =
        data.value.background.size == "bg__full" ? "" : data.value.background.color
    const gridValue = getGridCss(data.value.gridLayout.grid)

    const debouncedCalculateKPIs = useMemo(() => debounce(calculateKPIsCb, 1000), [])

    useEffect(() => {
        if (data.value.openingSection) {
            setScenarioModalType("openScenario")
            setShowScenarioModal(true)
        }
    }, [])

    useEffect(() => {
        setHolarchyFeedbackImages(
            content.filter(content => content.type == "holarchy_feedback_image"),
        )
        setLegendItems(
            convertLegendItems(content.filter(content => content.type == "legend_items")[0]),
        )
        savePageValues(saveCurrentValues(content))

        if (pagetype !== "Sandbox") {
            debouncedCalculateKPIs(content)
        } else {
            if (isInitialLoad) {
                setInitialContent(createCopyofContent([...content]))
                debouncedCalculateKPIs(content)
            }

            if (!isInitialLoad && !resetState) {
                // Added a timeout for better ux
                setTimeout(() => {
                    setDirtyState(true)
                }, 500)
            }
        }
    }, [content, debouncedCalculateKPIs])

    useEffect(() => {
        if (costBenefitModal || holarchyModal) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [costBenefitModal, holarchyModal])

    function openCostBenefitModal() {
        setCostBenefitModal(true)
    }

    function closeCostBenefitModal() {
        setCostBenefitModal(false)
    }

    function createCopyofContent(input: Content[]) {
        const returnArr: Content[] = []
        input.map(inputObj => {
            returnArr.push({ ...inputObj })
        })

        return returnArr
    }

    function resetContent() {
        // First set an empty array and after that fill the content with the initial content
        // TODO: Find a better way to reset the content. For now it works like this.
        setResetState(true)
        setContent([])
        setTimeout(() => {
            setContent(createCopyofContent([...initialContent]))
            debouncedCalculateKPIs([...initialContent])
        })
        setTimeout(() => {
            setResetState(false)
        }, 750)
        setDirtyState(false)
    }

    function openHolarchyModal() {
        setHolarchyModal(true)
    }

    function closeHolarchyModal() {
        setHolarchyModal(false)
    }

    function calculateKPIsCb(content) {
        setDirty()
        const interactiveElements = content
            .filter(
                (element): element is InteractiveContent =>
                    element.type == "interactive_input"
                    && element.currentValue !== undefined
                    && element.currentValue !== null
                    && element.currentValue.length !== 0,
            )
            .map((element): InteractiveElement => {
                return {
                    interactiveElement: element.value.id,
                    value:
                        Array.isArray(element.currentValue) ?
                            element.currentValue.join(",")
                        :   element.currentValue,
                }
            })

        const conditions = feedbackmodals.flatMap(feedbackmodal => feedbackmodal.value.conditions)
        const anylogicOutputKeys = conditions
            .filter(
                (condition): condition is AnyLogicOutputCondition =>
                    condition.type === "anylogic_output_condition",
            )
            .map(condition => condition.value.anylogicOutputKey)

        const datamodelQueryRules = conditions
            .filter(
                (condition): condition is DatamodelQueryCondition =>
                    condition.type === "datamodel_query_condition",
            )
            .map(condition => condition.value.datamodelQueryRule)

        calculateKPIs({
            interactiveElements: interactiveElements,
            scenario: scenario,
            anylogicOutputKeys,
            datamodelQueryRules,
        })
    }

    function convertLegendItems(items: Array<LegendItem>) {
        const return_arr = []
        if (items) {
            items.value?.legendItems.map(item => {
                if (return_arr[item.value?.type] === undefined) {
                    return_arr[item.value?.type] = []
                }
                return_arr[item.value?.type].push(item.value)
            })
        }
        return return_arr
    }

    const saveCurrentValues = (content: Content[]) => {
        //get currentValues of visible interactive elements
        const savedElements: SavedElements = {
            [data.id]: {},
        }

        content?.map((sectionItem: Content) => {
            if (sectionItem.type === "interactive_input" && sectionItem.value.visible) {
                const key = `${sectionItem.value.id}`
                const value = sectionItem.currentValue
                const name = sectionItem.value.name

                savedElements[data.id] = {
                    ...savedElements[data.id],
                    [key]: {
                        value: value,
                        name: name,
                    },
                }
            }
        })
        return savedElements
    }

    async function handleSaveScenario(title: string, description: string) {
        const url = saveScenario(title, description, data.id)

        const response = await fetch(`/api/tinyUrl`, {
            method: "POST",
            headers: {
                "Content-Type": `application/json`,
            },
            body: JSON.stringify({ url }),
        })

        if (response.ok) {
            const data = await response.json()
            const shortUrl = data.shortUrl
            setSavedScenarioURL(shortUrl)
        } else {
            setSavedScenarioURL(url)
        }

        setScenarioModalType("savedScenario")
    }

    return (
        <div className={`sectionContainer`} ref={sectionContainerRef}>
            {feedbackmodals && (
                <ChallengeFeedbackModal
                    feedbackmodals={feedbackmodals}
                    kpis={kpis}
                    anylogicOutputs={anylogicOutputs}
                    datamodelQueryResults={datamodelQueryResults}
                    content={content}
                />
            )}
            {costBenefitModal && costBenefitData && (
                <CostBenefitModal
                    handleClose={closeCostBenefitModal}
                    graphcolors={graphcolors ?? []}
                    costBenefitData={costBenefitData}
                    costBenefitWikiLink={costBenefitData}
                    wikilinks={wikilinks}
                    pagetitle={pagetitle}
                />
            )}
            {showScenarioModal && (
                <ScenarioModal
                    isOpen={showScenarioModal}
                    onClose={() => setShowScenarioModal(false)}
                    handleSaveScenario={handleSaveScenario}
                    type={scenarioModalType}
                    scenarioUrl={savedScenarioURL}
                    scenarioTitle={data.value.scenarioTitle}
                    scenarioDescription={data.value.scenarioDescription}
                    scenarioDiffElements={scenarioDiffElements}
                />
            )}

            <div className="holonContentContainer">
                <TwoColumnSimulationLayoutTwo columnSpec={data.value.gridLayout.grid}>
                    <div className={backgroundLeftColor}>
                        {data.value.background.size !== "bg_full" && !holarchyModal ?
                            <span className={`extra_bg ${backgroundLeftColor}`}></span>
                        :   ""}
                        {!holarchyModal && (
                            <ContentColumn
                                dataContent={data?.value.content}
                                content={content}
                                handleContentChange={setContent}
                                handleMedia={setMedia}
                                pagetype={pagetype}
                            />
                        )}
                    </div>

                    <div>
                        {dirtyState && (
                            <div className="absolute flex justify-center items-start p-12 top-0 left-0 w-full h-full bg-black/[.8] z-20">
                                <div className="bg-white p-12 w-50 inline-block mx-auto h-auto rounded sticky top-[50%]">
                                    <div>
                                        <div className="flex justify-center mt-6 items-center">
                                            <Button
                                                onClick={() => {
                                                    debouncedCalculateKPIs(content)
                                                    setDirtyState(false)
                                                }}
                                            >
                                                Reken ingesteld scenario door
                                            </Button>
                                            <button
                                                className="font-bold pl-3 pb-4"
                                                onClick={() => resetContent()}
                                            >
                                                Reset instellingen
                                            </button>
                                        </div>
                                        <p className="mb-4">
                                            Heb je het energiesysteem zo ingesteld als je wilt? Klik
                                            dan op &apos;Reken ingesteld scneario door&apos;
                                            hierboven. Het holon-simulatiemodel bouwt je ingestelde
                                            energiesysteem op en simuleert het gedrag van iedere
                                            energie-asset over een heel jaar. De resultaten worden
                                            samengevat in de vier KPIs.
                                        </p>
                                        <p>
                                            Wil je meer inzicht in de dynamieken, echte data
                                            inladen, of ander gedrag en funcionaliteiten?
                                            Waarschijnlijk kan dat, het simulatiemodel kan veel meer
                                            dan wat we hier aan gebruikers kunnen aanbieden.
                                            Informeer via{" "}
                                            <a
                                                style={{ display: "inline" }}
                                                href="mailto:info@holontool.nl"
                                            >
                                                info@holontool.nl
                                            </a>
                                            .
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div
                            className="lg:sticky top-24"
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                // minHeight makes it a bit more spacious on large screens
                                minHeight: "calc(100vh - 16rem)",
                            }}
                        >
                            <ShareButton
                                onClick={() => {
                                    setShowScenarioModal(true)
                                    setScenarioModalType("saveScenario")
                                }}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                }}
                            />
                            <div
                                className="py-12 px-10 lg:px-16"
                                style={{
                                    flexGrow: 1,
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                {Object.keys(media).length > 0 && (
                                    /* eslint-disable @next/next/no-img-element */
                                    <img
                                        src={media.img?.src}
                                        alt={media.img?.alt}
                                        width="1600"
                                        height="900"
                                    />
                                )}
                            </div>
                            <KPIDashboard
                                data={kpis}
                                simulationState={simulationState}
                                loadingState={loadingState}
                                loading={loading}
                                dashboardId={data.id}
                                handleClickHolarchy={openHolarchyModal}
                                handleClickCostBen={openCostBenefitModal}
                            />
                        </div>
                    </div>
                    <hr
                        className="border-holon-blue-900 absolute bottom-0 right-0"
                        style={{ width: "calc(100% - 2rem)" }}
                    />
                </TwoColumnSimulationLayoutTwo>

                {holarchyModal && (
                    <HolarchyTab
                        id={data.id}
                        pagetitle={pagetitle}
                        wikilink={wikilinks?.find(wikilink => wikilink.type === "holarchy")}
                        holarchyFeedbackImages={holarchyFeedbackImages}
                        legendItems={legendItems}
                        content={content}
                        dataContent={data?.value.content}
                        handleContentChange={setContent}
                        handleMedia={setMedia}
                        textLabelNational={data.value.textLabelNational}
                        textLabelIntermediate={data.value.textLabelIntermediate}
                        textLabelLocal={data.value.textLabelLocal}
                        loading={loading}
                        kpis={kpis}
                        closeHolarchyModal={closeHolarchyModal}
                    />
                )}
            </div>
        </div>
    )
}
