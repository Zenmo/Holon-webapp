import { Dialog, Transition } from "@headlessui/react"
import { EnvelopeIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline"
import { Fragment, useState } from "react"
import Button from "../../../Button/Button"
import { CloseButton } from "@/components/Button/CloseButton"

type ScenarioModal = {
    isOpen: boolean
    onClose: () => void
    handleSaveScenario: (title: string, description: string) => string
    type: "saveScenario" | "savedScenario" | "openScenario"
    scenarioUrl?: string
    scenarioTitle: string
    scenarioDescription: string
    scenarioDiffElements:
        | object
        | {
              subKey: {
                  value: string
                  difference: string
                  section: number
                  name?: string
              }
          }
}

export default function ScenarioModal({
    isOpen,
    onClose,
    handleSaveScenario,
    type,
    scenarioUrl,
    scenarioTitle,
    scenarioDescription,
    scenarioDiffElements,
}: ScenarioModal) {
    const [scenarioDetails, setScenarioDetails] = useState({
        scenarioTitle: "",
        scenarioDescription: "",
    })
    const [copied, setCopied] = useState<boolean>(false)

    const textMessageLink = encodeURIComponent(
        `Ik heb een scenario aangemaakt op https://holons.energy. Bekijk het scenario via deze link: ${scenarioUrl}`,
    )

    function closeModal() {
        onClose()
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
        e.preventDefault()
        setScenarioDetails({ ...scenarioDetails, [e.target.name]: e.target.value })
    }

    function onSaveScenario(e) {
        e.preventDefault()
        handleSaveScenario(scenarioDetails.scenarioTitle, scenarioDetails.scenarioDescription)
    }

    function listDifferentElements(values: ScenarioModal["scenarioDiffElements"]) {
        const elements = []
        for (const key in values) {
            const value = values[key]
            for (const subKey in value) {
                if (value[subKey].difference === "missing") {
                    elements.push(
                        <p className="text-sm mt-1">{`- In sectie ${value[subKey].section} is interactief element ${value[subKey].name} verwijderd van de pagina.`}</p>,
                    )
                } else if (value[subKey].difference === "added") {
                    elements.push(
                        <p className="text-sm mt-1">{`- In sectie ${value[subKey].section} is interactief element ${value[subKey].name} toegevoegd aan de pagina.`}</p>,
                    )
                }
            }
        }
        return elements
    }

    const ScenarioType = {
        saveScenario: {
            title: "Scenario delen",
            content: (
                <>
                    <div>
                        <div className="text-holon-blue-900 flex flex-col items-start">
                            <p className="text-left">
                                Deel hier de instellingen van je scenario op. Let op: wijzigingen
                                kunnen niet aan een bestaand scenario worden toegevoegd. Daarvoor
                                moet een nieuwe link worden gegenereerd.
                            </p>
                            <form
                                className="text-base flex flex-col items-start font-semibold w-full mt-2"
                                onSubmit={onSaveScenario}
                                id="saveScenario"
                            >
                                <label>Scenario naam</label>
                                <input
                                    type="text"
                                    id="scenarioTitle"
                                    name="scenarioTitle"
                                    className="border border-holon-gray-200 w-full h-10 mb-2 px-2 font-semibold"
                                    onChange={handleInputChange}
                                    required
                                ></input>
                                <label>Scenario beschrijving (optioneel)*</label>
                                <textarea
                                    type="text"
                                    id="scenarioDescription"
                                    name="scenarioDescription"
                                    maxLength={150}
                                    className="border border-holon-gray-200 h-20 w-full px-2 overflow-y-auto font-medium"
                                    onChange={handleInputChange}
                                ></textarea>
                                <p className="text-xs text-holon-gray-300 ml-1">* max 150 tekens</p>
                            </form>
                        </div>
                        <div className="flex flex-row justify-end mt-2">
                            <Button
                                variant="light"
                                className="text-holon-blue-900 hover:text-white mr-2"
                                type="button"
                                onClick={closeModal}
                            >
                                Annuleren
                            </Button>
                            <Button variant="dark" type="submit" value="Submit" form="saveScenario">
                                Scenario delen
                            </Button>
                        </div>
                    </div>
                </>
            ),
        },
        savedScenario: {
            title: "Scenario opgeslagen",
            content: (
                <>
                    <div>
                        <div className="text-holon-blue-900 flex flex-col items-start">
                            <p className="text-left">
                                Copy/paste de opgeslagen scenario link om de instellingen met
                                collega&apos;s te delen.
                            </p>

                            <h3 className="text-left text-base mt-1">Gegenereerd scenario-URL</h3>
                            <div className="flex flex-row w-full  mt-1">
                                <p className="text-left truncate text-ellipsis w-full border p-1 h-[3rem] border-holon-gray-200">
                                    {scenarioUrl}
                                </p>
                                <Button
                                    variant="dark"
                                    onClick={() => {
                                        navigator.clipboard.writeText(scenarioUrl)
                                        setCopied(!copied)
                                    }}
                                >
                                    {copied ? "Gekopieerd!" : "Kopieer link"}
                                </Button>
                            </div>
                            <div>
                                <h3 className="text-left text-base">Deel via:</h3>
                                <div className="flex flex-row">
                                    <a
                                        href={`mailto:?body=${textMessageLink}&subject=Holonscenario`}
                                        className="mr-2 buttonLight"
                                        rel="noopener noreferrer"
                                        target="_blank"
                                    >
                                        <EnvelopeIcon className="w-4 h-4 mr-2"></EnvelopeIcon>
                                        E-mail
                                    </a>

                                    <a
                                        className="buttonLight mr-2"
                                        rel="noopener noreferrer"
                                        target="_blank"
                                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${scenarioUrl}`}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src="/imgs/linkedin.png"
                                            alt="logo LinkedIn"
                                            width={20}
                                            height={20}
                                            className="mr-2"
                                        />
                                        LinkedIn
                                    </a>

                                    <a
                                        href={`https://twitter.com/intent/tweet?text=${textMessageLink}`}
                                        className="buttonLight"
                                        rel="noopener noreferrer"
                                        target="_blank"
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src="/imgs/twitter.png"
                                            alt="logo twitter"
                                            width={20}
                                            height={20}
                                            className="mr-2"
                                        />
                                        Twitter
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="mt-2">
                            <p className="p-4 bg-holon-gray-100 text-holon-blue-900 text-left text-sm">
                                Copy/paste de opgeslagen scenario link om de instellingen met
                                collega&apos;s te delen.
                            </p>
                        </div>
                    </div>
                </>
            ),
        },
        openScenario: {
            title: `Open scenario: ${scenarioTitle}`,
            content: (
                <>
                    <div>
                        <div className="text-holon-blue-900 flex flex-col items-start">
                            <p className="text-left">{scenarioDescription}</p>
                        </div>
                        {/*als er verschillen zijn tussen int elm -> hier disclaimer laten zien */}
                        {Object.keys(scenarioDiffElements).length !== 0 && (
                            <div className="mt-2">
                                <div className="p-4 bg-holon-gray-100 text-holon-blue-900 text-left  flex flex-row">
                                    <QuestionMarkCircleIcon className="w-6 h-6 mr-2" />
                                    <div>
                                        <p className="text-sm">
                                            De interactieve elementen in dit scenario zijn anders
                                            dan de opgeslagen elementen:
                                        </p>
                                        <ul>
                                            {listDifferentElements(scenarioDiffElements).map(
                                                (element, index) => (
                                                    <li className="text-sm mt-1" key={index}>
                                                        {element}
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-row justify-center mt-2">
                            <Button variant="dark" onClick={closeModal}>
                                Open scenario
                            </Button>
                        </div>
                    </div>
                </>
            ),
        },
    }

    return (
        <Fragment>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel
                                    className={`w-full p-relative max-w-md min-w-[40vw] transform overflow-hidden rounded p-6 text-center align-middle shadow-xl transition-all text-white flex flex-col gap-4 bg-white`}
                                >
                                    <div className="flex flex-row justify-between">
                                        <Dialog.Title
                                            as="h2"
                                            className="leading-6 text-2xl text-holon-blue-900 font-bold text-left"
                                        >
                                            {ScenarioType[type].title}
                                        </Dialog.Title>
                                        <CloseButton
                                            onClick={closeModal}
                                            className="text-gray-800"
                                        />
                                    </div>
                                    <div>{ScenarioType[type].content}</div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </Fragment>
    )
}
