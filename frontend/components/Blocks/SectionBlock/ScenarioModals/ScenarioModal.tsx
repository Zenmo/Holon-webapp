import { Dialog, Transition } from "@headlessui/react";
import { EnvelopeIcon, QuestionMarkCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment, useState } from "react";

import Button from "../../../Button/Button";

type ScenarioModal = {
  isOpen: boolean;
  onClose: () => void;
  handleSaveScenario: (title: string, description: string) => void;
  type: "saveScenario" | "savedScenario" | "openScenario";
  scenarioUrl: string;
  scenarioTitle: string;
  scenarioDescription: string;
};

export default function ScenarioModal({
  isOpen,
  onClose,
  handleSaveScenario,
  type,
  scenarioUrl,
  scenarioTitle,
  scenarioDescription,
}: ScenarioModal) {
  const [scenarioDetails, setScenarioDetails] = useState({
    scenarioTitle: "",
    scenarioDescription: "",
  });
  const [copied, setCopied] = useState<boolean>(false);
  const textMessageLink = encodeURIComponent(
    `Ik heb een scenario aangemaakt op www.holontool.nl. Bekijk het scenario via deze link: ${scenarioUrl}`
  );

  function closeModal() {
    onClose();
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
    e.preventDefault();
    setScenarioDetails({ ...scenarioDetails, [e.target.name]: e.target.value });
  }

  function onSaveScenario() {
    handleSaveScenario(scenarioDetails.scenarioTitle, scenarioDetails.scenarioDescription);
  }

  const ScenarioType = {
    saveScenario: {
      title: "Scenario opslaan",
      content: (
        <>
          <div>
            <div className="text-holon-blue-900 flex flex-col items-start">
              <p className="text-left">
                Sla hier je scenario op. Let op: wijzigingen kunnen niet aan een bestaand scenario
                worden toegevoegd. Daarvoor moet een nieuwe link worden gegenereerd.
              </p>
              <form
                className="text-base flex flex-col items-start font-semibold w-full"
                onSubmit={onSaveScenario}
                id="saveScenario">
                <label>Scenario naam</label>
                <input
                  type="text"
                  id="scenarioTitle"
                  name="scenarioTitle"
                  className="border border-holon-gray-200 w-full h-10 my-1 px-2"
                  onChange={handleInputChange}
                  required></input>
                <label>Scenario beschrijving (optioneel)</label>
                <input
                  type="text"
                  id="scenarioDescription"
                  name="scenarioDescription"
                  maxLength={150}
                  className="border border-holon-gray-200 w-full h-10 my-1 px-2"
                  onChange={handleInputChange}></input>
              </form>
            </div>
            <div className="flex flex-row justify-end mt-2">
              <Button
                variant="light"
                className="text-holon-blue-900 hover:text-white mr-2"
                type="button"
                onClick={closeModal}>
                Annuleren
              </Button>
              <Button variant="dark" type="submit" value="Submit" form="saveScenario">
                Scenario opslaan
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
                Copy/paste de opgeslagen scenario link om de instellingen met collega's te delen.
              </p>

              <h3 className="text-left text-base">Gegenereerd scenario-URL</h3>
              <div className="flex flex-row w-full  mt-2">
                <p className="text-left truncate text-ellipsis border p-1 h-[3rem] border-holon-gray-200">
                  {scenarioUrl}
                </p>
                <Button
                  variant="dark"
                  onClick={() => {
                    navigator.clipboard.writeText(scenarioUrl);
                    setCopied(!copied);
                  }}>
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
                    target="_blank">
                    <EnvelopeIcon className="w-4 h-4 mr-2"></EnvelopeIcon>
                    E-mail
                  </a>
                  <a
                    href={`https://linkedin.com/shareArticle?text=${textMessageLink}`}
                    className="mr-2 buttonLight"
                    rel="noopener noreferrer"
                    target="_blank">
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
                    target="_blank">
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
                Copy/paste de opgeslagen scenario link om de instellingen met collega's te delen.
              </p>
            </div>
          </div>
        </>
      ),
    },
    openScenario: {
      title: `Open scenario ${scenarioTitle}`,
      content: (
        <>
          <div>
            <div className="text-holon-blue-900 flex flex-col items-start">
              <p className="text-left">{scenarioDescription}</p>
            </div>
            {/*als er verschillen zijn tussen int elm -> hier disclaimer laten zien */}
            <div className="mt-2">
              <p className="p-4 bg-holon-gray-100 text-holon-blue-900 text-left text-sm">
                <QuestionMarkCircleIcon className="w-4 h-4" />
                De interactieve elementen in dit scenario zijn anders dan de opgeslagen elementen:
                <ul></ul>
              </p>
            </div>
            <div className="flex flex-row justify-center mt-2">
              <Button variant="dark" onClick={closeModal}>
                Open scenario
              </Button>
            </div>
          </div>
        </>
      ),
    },
  };

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
            leaveTo="opacity-0">
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
                leaveTo="opacity-0 scale-95">
                <Dialog.Panel
                  className={`w-full p-relative max-w-md min-w-[40vw] transform overflow-hidden rounded p-6 text-center align-middle shadow-xl transition-all text-white flex flex-col gap-4 bg-white`}>
                  <div className="flex flex-row justify-between">
                    <Dialog.Title
                      as="h2"
                      className="leading-6 text-2xl text-holon-blue-900 font-bold">
                      {ScenarioType[type].title}
                    </Dialog.Title>
                    <button type="button" className="text-gray-800" onClick={closeModal}>
                      <XMarkIcon className="h-6 w-6 " />
                    </button>
                  </div>
                  <div>{ScenarioType[type].content}</div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </Fragment>
  );
}
