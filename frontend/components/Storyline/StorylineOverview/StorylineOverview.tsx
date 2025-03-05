import { useState } from "react"
import Card from "../../Card/Card"
import StorylineOverviewFilter from "./StorylineOverviewFilter"

import { StoryLineItem as StoryLineItemData } from "./types"

interface Props {
    storylines: StoryLineItemData[]
    allInformationTypes: [
        {
            name: string
            slug: string
        },
    ]
    allRoles: [
        {
            name: string
            slug: string
        },
    ]
}
export default function StorylineOverview({ storylines, allInformationTypes, allRoles }: Props) {
    const [selectedRoles, setSelectedRoles] = useState<string[]>([])
    const [selectedInformation, setSelectedInformation] = useState<string[]>([])

    const updateRole = (role: string) => {
        if (selectedRoles.includes(role)) {
            setSelectedRoles(prevArray => [...prevArray.filter(item => item !== role)])
        } else {
            setSelectedRoles(prevArray => [...prevArray, role])
        }
    }

    const updateInformation = (information: string) => {
        if (selectedInformation.includes(information)) {
            setSelectedInformation(prevArray => [...prevArray.filter(item => item !== information)])
        } else {
            setSelectedInformation(prevArray => [...prevArray, information])
        }
    }

    function filterStorylines(
        storylines: StoryLineItemData[],
        attribute: "roles" | "informationTypes",
        selectedTags: string[],
    ) {
        if (selectedTags.length === 0) {
            return storylines
        }

        return storylines.filter(storyline => {
            const tags = storyline[attribute].map(tag => tag.name)
            return selectedTags.some(tag => tags.includes(tag))
        })
    }

    const filteredProjects = filterStorylines(
        filterStorylines(storylines, "roles", selectedRoles),
        "informationTypes",
        selectedInformation,
    )

    return (
        <div className="holonContentContainer">
            <div className="flex w-full flex-col lg:flex-row" data-testid="storyline-overview">
                <div className="flex flex-col defaultBlockPadding lg:w-1/3 xl:w-1/4">
                    <StorylineOverviewFilter
                        title="Type rol"
                        name="role"
                        items={allRoles}
                        selectedItems={selectedRoles}
                        update={updateRole}
                    />
                    <StorylineOverviewFilter
                        title="Type informatie"
                        name="information"
                        items={allInformationTypes}
                        selectedItems={selectedInformation}
                        update={updateInformation}
                    />
                </div>
                <div className="flex flex-col defaultBlockPadding lg:w-2/3 xl:w-3/4">
                    <div className="flex flex-row justify-between mb-2">
                        <strong>{filteredProjects?.length} resultaten</strong>
                    </div>

                    <div className="flex flex-row flex-wrap justify-center md:justify-start mx-[-1rem]">
                        {filteredProjects?.map((project, index) => (
                            <div
                                key={index}
                                className="px-[1rem] flex-[0_0_50%] sm:flex-[0_0_33%] lg:flex-[0_0_25%] xl:flex-[0_0_20%]"
                            >
                                <Card cardItem={project} cardType="storylineCard" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
