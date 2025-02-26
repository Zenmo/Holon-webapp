import { Content } from "@/components/Blocks/SectionBlock/types"
import { StaticImage } from "@/components/ImageSelector/types"
import HolarchyKPIDashboard from "@/components/KPIDashboard/HolarchyKPIDashboard"
import HolarchyFeedbackImage, {
    HolarchyFeedbackImageProps,
} from "../../HolarchyFeedbackImage/HolarchyFeedbackImage"
import ContentColumn from "../ContentColumn"
import LegendModal, { LegendItem } from "./LegendModal"
import { KPIsByScale } from "@/api/holon"
import { CloseButton } from "@/components/Button/CloseButton"
import { ChevronLeftIcon } from "@heroicons/react/20/solid"
import { WikiLink } from "@/containers/types"
import InteractiveInputPopover, {
    PopoverHorizontalPosition,
} from "@/components/InteractiveInputs/InteractiveInputPopover"
import { useEffect } from "react"

type HolarchyTab = {
    id: string
    pagetitle: string
    wikilink?: WikiLink
    holarchyFeedbackImages: Array<HolarchyFeedbackImageProps>
    legendItems: Array<LegendItem>
    content: Array<Content>
    dataContent: Content[]
    handleContentChange: React.Dispatch<React.SetStateAction<Content[]>>
    handleMedia: React.Dispatch<React.SetStateAction<StaticImage>>
    textLabelNational: string
    textLabelIntermediate: string
    textLabelLocal: string
    loading: boolean
    kpis: KPIsByScale
    closeHolarchyModal: () => void
}

export default function HolarchyTab({
    id,
    pagetitle,
    wikilink,
    holarchyFeedbackImages,
    legendItems,
    content,
    dataContent,
    handleContentChange,
    handleMedia,
    textLabelNational,
    textLabelIntermediate,
    textLabelLocal,
    loading,
    kpis,
    closeHolarchyModal,
}: HolarchyTab) {
    const levels = ["national", "intermediate", "local"]

    useEffect(() => {
        window.location.hash = "#holarchie-" + id
        const handlePopState = (event: PopStateEvent) => {
            // prevent scrolling back to a section after closing the modal
            window.location.hash = "#"
            closeHolarchyModal()
        }

        window.addEventListener("popstate", handlePopState)

        return () => window.removeEventListener("popstate", handlePopState)
    })

    return (
        <div
            className="bg-white fixed top-0 overflow-auto md:overflow-hidden inset-x-0 mx-auto w-screen"
            style={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                zIndex: 50,
            }}
        >
            <div
                className="sticky flex flex-row items-center bg-white px-10 lg:px-16 pl-4 shadow-[0_3px_2px_-2px_rgba(0,0,0,0.3)]"
                style={{
                    justifyContent: "space-between",
                }}
            >
                <button
                    onClick={() => history.back()}
                    style={{ display: "flex", alignItems: "center" }}
                >
                    <ChevronLeftIcon style={{ width: "2rem" }} />
                    Terug naar {pagetitle}
                </button>
                <CloseButton
                    onClick={() => history.back()}
                    style={{
                        padding: ".5rem",
                        height: "100%",
                        width: "3rem",
                    }}
                />
            </div>
            <div
                className="bg-white z-15 grid grid-rows-9 grid-cols-1 md:grid-cols-3 md:grid-rows-3"
                style={{
                    flexGrow: "1",
                    overflow: "hidden",
                }}
            >
                {/* Left column: Legend + Interactive input in  */}
                <div className="bg-gray-100 p-4 grid-rows-3 overflow-y-auto row-span-3 col-start-1 col-span-1 relative">
                    {wikilink && (
                        <InteractiveInputPopover
                            style={{ position: "absolute", top: "1rem", right: "1rem" }}
                            textColor="text-holon-blue-900"
                            name={"Meer informatie"}
                            titleWikiPage={`Meer informatie over Holarchie binnen ${pagetitle}`}
                            linkWikiPage={wikilink.value}
                            target="_blank"
                            popoverHorizontalPosition={PopoverHorizontalPosition.LEFT}
                        />
                    )}
                    <LegendModal data={legendItems} />
                    <br />
                    {/* Display content in order national - regional - local */}
                    {levels.map((level, index) => {
                        return (
                            <ContentColumn
                                key={index}
                                dataContent={dataContent}
                                content={content}
                                handleContentChange={handleContentChange}
                                handleMedia={handleMedia}
                                selectedLevel={level}
                            />
                        )
                    })}
                </div>

                <div className="row-span-1 row-start-4 col-start-1 col-span-1 md:col-start-2  md:col-span-1  md:row-span-3 md:row-start-1 grid grid-rows grid-rows-3 overflow-hidden">
                    {/*image - highest block*/}
                    <div className="row-start-1 bg-holon-holarchy-national row-span-1 col-start-1 col-span-1 "></div>

                    {/*image - middle block showing image*/}
                    <div className="relative bg-holon-holarchy-intermediate row-start-2 row-span-1 col-start-1 col-span-1 ">
                        {holarchyFeedbackImages.length > 0 && (
                            <HolarchyFeedbackImage
                                holarchyfeedbackimages={holarchyFeedbackImages}
                                content={content}
                            />
                        )}
                    </div>

                    {/*image - lowest block*/}
                    <div className="bg-holon-holarchy-local  row-start-3 row-span-1 col-start-1 col-span-1"></div>
                </div>
                {/* KPIs - right column */}
                {/*National KPIs */}

                <HolarchyKPIDashboard
                    textLabelNational={textLabelNational}
                    textLabelIntermediate={textLabelIntermediate}
                    textLabelLocal={textLabelLocal}
                    loading={loading}
                    data={kpis}
                ></HolarchyKPIDashboard>
            </div>
        </div>
    )
}
