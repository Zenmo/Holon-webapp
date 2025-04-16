import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import {
    AnyLogicEmbedBlock, CardBlockVariant,
    Graphcolor,
    HeroBlockVariant,
    NextInletVariant,
    PageProps,
    RowBlockVariant,
    SectionVariant,
    StepIndicatorVariant,
    TextAndMediaVariant,
    TitleBlockVariant,
    WikiLink,
} from "../../containers/types"
import ButtonsAndMediaBlock from "./ButtonsAndMediaBlock/ButtonsAndMediaBlock"
import CardBlock from "./CardsBlock/CardBlock"
import { FeedbackModal } from "./ChallengeFeedbackModal/types"
import HeaderFullImageBlock from "./HeaderFullImageBlock/HeaderFullImageBlock"
import HeroBlock from "./HeroBlock/HeroBlock"
import ParagraphBlock from "./ParagraphBlock"
import SectionBlock from "./SectionBlock/SectionBlock"
import {Content, RichTextBlock, SavedElements} from "./SectionBlock/types"
import TableBlock from "./TableBlock/TableBlock"
import TextAndMediaBlock from "./TextAndMediaBlock/TextAndMediaBlock"
import TitleBlock from "./TitleBlock/TitleBlock"
import { StepIndicatorWrapper } from "@/components/Storyline/Steps/StepIndicatorWrapper"
import {NextInletBlock} from "@/components/Blocks/NextInlet"
import {RowBlock} from "@/components/Blocks/RowBlock"
import RawHtml from "@/components/RawHtml"
import {AnyLogicEmbed} from "@/components/Blocks/AnyLogicEmbed"

type ContentBlockProps = PageProps<
    | TextAndMediaVariant
    | HeroBlockVariant
    | TitleBlockVariant
    | CardBlockVariant
    | SectionVariant
    | StepIndicatorVariant
    | NextInletVariant
    | RowBlockVariant
    | RichTextBlock
    | AnyLogicEmbedBlock
>

const ContentBlocks = ({
    content,
    wikilinks,
    pagetitle,
    pagetype,
    feedbackmodals,
    graphcolors,
}: {
    content: ContentBlockProps[]
    feedbackmodals?: FeedbackModal[]
    pagetype?: string
    graphcolors?: Graphcolor[]
    wikilinks?: WikiLink[]
    pagetitle?: string
}) => {
    let targetValuesPreviousSections = new Map()
    const [currentPageValues, setCurrentPageValues] = useState({})
    const [savedValues, setSavedValues] = useState({})
    const [checkedSavedValues, setCheckedSavedValues] = useState(false)
    const [openingSection, setOpeningSection] = useState<string>("")

    const router = useRouter()
    const scenarioDiffElements = {}
    let sectionCount = 0

    useEffect(() => {
        checkIfSavedScenario()
        if (Object.keys(savedValues).length !== 0) {
            const elem = document.getElementById(openingSection)
            elem?.scrollIntoView({ behavior: "smooth" })
        }
    }, [])

    /*Adds target values of previous sections to interactive elements in the section */
    function addTargetValues(values, content: Content[]) {
        const updatedContent = { ...content }
        const uniqueTargetValues = []

        values.forEach((value, key) => {
            const foundElement = updatedContent.value.content.find(element => {
                return element.type === "interactive_input" && element.value.id === key
            })

            if (foundElement) {
                foundElement.value.targetValuePreviousSection = value.targetValue
            } else {
                //if the element does not exist yet it is added to an array (the element is invisible and with no other defaultValues besides the target value(s))
                uniqueTargetValues.unshift({
                    type: "interactive_input",
                    value: {
                        ...value,
                        visible: false,
                        defaultValueOverride: "",
                        targetValuePreviousSection: value.targetValue,
                        options: value.options.map(option => ({
                            ...option,
                            default: false,
                        })),
                    },
                })
            }
        })
        //the array target values is placed in front of the list with interactive input elements, keeping the order in which they were placed on the page
        uniqueTargetValues.map(item => {
            updatedContent.value.content.unshift(item)
        })

        return updatedContent
    }

    /*loops through current section and if there is an interactive element with a target value it creates a clone of the map, either updating an existing interactive input or adding one and then setting that clone to the variable targetValue*/
    function updateTargetValues(content: Content[]) {
        content.map(element => {
            if (element.type === "interactive_input" && element.value.targetValue) {
                const newTargetValues = new Map(targetValuesPreviousSections)
                newTargetValues.set(element.value.id, element.value)
                targetValuesPreviousSections = newTargetValues
            }
        })
        return null
    }

    /*Saves all current values of visible interactive elements in a section */
    function saveSectionValues(sectionValue: SavedElements) {
        const newCurrentPageValues = Object.assign(currentPageValues, sectionValue)
        setCurrentPageValues(newCurrentPageValues)
    }

    /*Save scenario functionality. Creates a link of the page with the current values of visible interactive elements of the different sections in the params*/
    function saveScenario(title: string, description: string, sectionId: string) {
        //get origin url
        const origin =
            typeof window !== "undefined" && window.location.origin ? window.location.origin : ""

        //make sure no exisiting params are including in the new url
        const pathWithoutParams = router.asPath.split("?")[0]
        //create baseURL
        const baseURL = `${origin}${pathWithoutParams}`

        //create params
        const params = new URLSearchParams()
        const data = currentPageValues

        for (const section in data) {
            for (const key in data[section]) {
                const encodedKey = encodeURIComponent(`${section}.${key}`)
                const encodedValue = encodeURIComponent(
                    `${data[section][key].value}.${data[section][key].name}`,
                )
                params.append(encodedKey, encodedValue)
            }
        }
        params.append("title", encodeURIComponent(title))
        params.append("currentSection", encodeURIComponent(sectionId))
        description && params.append("description", encodeURIComponent(description))

        //create link
        const savedScenarioUrl = `${baseURL}?${params.toString()}`
        return savedScenarioUrl
    }

    /*When the page opens it checks whether it has a saved scenario in the params */
    function checkIfSavedScenario() {
        const urlParams =
            typeof window !== "undefined" && window.location.origin ?
                new URLSearchParams(window.location.search)
            :   null

        const data = {}

        if (urlParams) {
            for (const [encodedKey, encodedValue] of urlParams) {
                const decodedKey = decodeURIComponent(encodedKey)
                const decodedValue = decodeURIComponent(encodedValue)

                if (decodedKey === "title") {
                    data[decodedKey] = decodedValue
                } else if (decodedKey === "description") {
                    data[decodedKey] = decodedValue
                } else if (decodedKey === "currentSection") {
                    data[decodedKey] = decodedValue
                    setOpeningSection(decodedValue)
                } else {
                    const [section, key] = decodedKey.split(".")
                    const [value, name] = decodedValue.split(".")
                    if (!(section in data)) {
                        data[section] = {}
                    }
                    data[section][key] = {
                        value: value,
                        name: name,
                    }
                }
            }
        }
        setSavedValues(data)
        setCheckedSavedValues(true)
    }

    //If there is a saved scenario in the params, the values are added to the section data.
    function addSavedValues(values: SavedElements, content: Content, sectionNumber: number) {
        //add saved values to content or scenarioDiffElements
        const updatedContent = { ...content }
        for (const key in values) {
            if (key === "title") {
                updatedContent.value.scenarioTitle = values[key]
            } else if (key === "description") {
                updatedContent.value.scenarioDescription = values[key]
            } else if (key === "currentSection" && values[key] === content.id) {
                updatedContent.value.openingSection = true
            } else if (key === content.id) {
                const value = values[key]

                for (const subKey in value) {
                    const foundElement = updatedContent.value.content.find(element => {
                        return (
                            element.type === "interactive_input"
                            && element.value.id === Number(subKey)
                        )
                    })
                    if (foundElement) {
                        const subValue = value[subKey].value
                        foundElement.value.savedValue = subValue
                    } else {
                        scenarioDiffElements[content.id] = {
                            ...(scenarioDiffElements[content.id] || {}),

                            [subKey]: {
                                value: value[subKey].value,
                                difference: "missing",
                                section: sectionNumber,
                                name: value[subKey].name,
                            },
                        }
                    }
                }
            }
        }

        // Check for elements in content that are not in values to show any differences
        let valuesIds: string[]
        values[content.id] ? (valuesIds = Object.keys(values[content.id])) : (valuesIds = [])

        for (const element of updatedContent.value.content) {
            if (
                element.type === "interactive_input"
                && element.value.visible === true
                && !valuesIds.includes(element.value.id.toString())
            ) {
                const subKey = element.value.id.toString()

                scenarioDiffElements[content.id] = {
                    ...(scenarioDiffElements[content.id] || {}),
                    [subKey]: {
                        value: element.value,
                        difference: "added",
                        section: sectionNumber,
                        name: element.value.name,
                    },
                }
            }
        }
        return updatedContent
    }

    return (
        <React.Fragment>
            {content?.map(contentItem => {
                switch (contentItem.type) {
                    case "header_full_image_block":
                        return (
                            <HeaderFullImageBlock
                                key={`headerfull ${contentItem.id}`}
                                data={contentItem}
                            />
                        )
                    case "paragraph_block":
                        return (
                            <ParagraphBlock
                                key={`paragraphBlock ${contentItem.id}`}
                                data={contentItem}
                            />
                        )
                    case "table_block":
                        return (
                            <div className="holonContentContainer defaultBlockPadding">
                                <TableBlock
                                    key={`tableBlock ${contentItem.id}`}
                                    data={contentItem}
                                />
                                ;
                            </div>
                        )
                    case "text_image_block":
                        return (
                            <TextAndMediaBlock
                                key={`txtmedia ${contentItem.id}`}
                                data={contentItem}
                            />
                        )
                    case "next_inlet_block":
                        return <NextInletBlock key={contentItem.id} contentItem={contentItem} />
                    case "hero_block":
                        return <HeroBlock key={`heroblock ${contentItem.id}`} data={contentItem} />
                    case "title_block":
                        return (
                            <TitleBlock key={`titleblock ${contentItem.id}`} data={contentItem} />
                        )
                    case "card_block":
                        return <CardBlock key={`cardsblock ${contentItem.id}`} data={contentItem} />
                    case "row_block":
                        return <RowBlock key={`rowblock-${contentItem.id}`} {...contentItem} />
                    case "anylogic_embed":
                        return <AnyLogicEmbed key={`rowblock-${contentItem.id}`} contentItem={contentItem}  />
                    case "step_indicator":
                        return (
                            <StepIndicatorWrapper
                                key={contentItem.id}
                                stepIndicatorBlock={contentItem}
                            >
                                {contentItem.value.map(section => {
                                    switch (section.type) {
                                        case "step_anchor":
                                            // anchor to scroll to
                                            return (
                                                <span
                                                    id={section.id}
                                                    key={section.id}
                                                    style={{
                                                        display: "block",
                                                        position: "relative",
                                                        top: "-4.5rem", // compensate for fixed site header
                                                        visibility: "hidden",
                                                    }}
                                                />
                                            )
                                        case "section":
                                            sectionCount++
                                            const newContent = addTargetValues(
                                                targetValuesPreviousSections,
                                                section,
                                            )
                                            //if there are any savedValues in the parameters, these are added to the section
                                            const savedValuesContent =
                                                Object.keys(savedValues).length !== 0 ?
                                                    addSavedValues(
                                                        savedValues,
                                                        newContent,
                                                        sectionCount,
                                                    )
                                                :   newContent
                                            updateTargetValues(section.value.content)

                                            return (
                                                <SectionBlock
                                                    key={`section ${section.id}`}
                                                    pageSectionCount={sectionCount}
                                                    data={savedValuesContent}
                                                    pagetype={pagetype}
                                                    feedbackmodals={feedbackmodals ?? []}
                                                    graphcolors={graphcolors ?? []}
                                                    savePageValues={saveSectionValues}
                                                    saveScenario={saveScenario}
                                                    scenarioDiffElements={scenarioDiffElements}
                                                    wikilinks={wikilinks}
                                                    pagetitle={pagetitle}
                                                />
                                            )
                                        default:
                                            return <ContentBlocks content={[section]} key={`section ${section.id}`} />
                                    }
                                })}
                            </StepIndicatorWrapper>
                        )
                    case "section":
                        sectionCount++
                        const newContent = addTargetValues(
                            targetValuesPreviousSections,
                            contentItem,
                        )
                        //if there are any savedValues in the parameters, these are added to the section
                        const savedValuesContent =
                            Object.keys(savedValues).length !== 0 ?
                                addSavedValues(savedValues, newContent, sectionCount)
                            :   newContent
                        updateTargetValues(contentItem.value.content)
                        return (
                            checkedSavedValues && (
                                <SectionBlock
                                    key={`section ${contentItem.id}`}
                                    pageSectionCount={sectionCount}
                                    data={savedValuesContent}
                                    pagetype={pagetype}
                                    feedbackmodals={feedbackmodals ?? []}
                                    graphcolors={graphcolors ?? []}
                                    savePageValues={saveSectionValues}
                                    saveScenario={saveScenario}
                                    scenarioDiffElements={scenarioDiffElements}
                                    wikilinks={wikilinks}
                                    pagetitle={pagetitle}
                                />
                            )
                        )
                    case "buttons_and_media_block":
                        return (
                            <ButtonsAndMediaBlock
                                key={`buttonsmedia ${contentItem.id}`}
                                data={contentItem}
                            />
                        )
                    case "text":
                        return <RawHtml key={`text_${contentItem.id}`} html={contentItem.value} />
                    default:
                        console.log("Unknown block type", contentItem)
                }
            })}
        </React.Fragment>
    )
}

export default ContentBlocks
