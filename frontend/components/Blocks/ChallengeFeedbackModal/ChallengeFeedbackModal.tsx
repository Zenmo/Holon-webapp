import Button from "@/components/Button/Button";
import {Dialog, Transition} from "@headlessui/react";
import {Fragment, useEffect, useState} from "react";
import Confetti from "react-confetti";
import {Content} from "../SectionBlock/types";
import {ConditionType, FeedbackModal} from "./types";
import {KPIQuad, KPIsByScale} from "@/api/holon";
import {snakeToCamel} from "@/utils/caseconverters";

type ChallengeFeedbackModalProps = {
  kpis: KPIsByScale;
  anylogicOutputs: Record<string, number>
  datamodelQueryResults: Record<number, number>
  loading: boolean;
  modalshowonce: boolean;
  dashboardId: string;
  content: Content;
  feedbackmodals: FeedbackModal[];
};

export default function ChallengeFeedbackModal({
  kpis,
  anylogicOutputs,
  datamodelQueryResults,
  content,
  feedbackmodals,
}: ChallengeFeedbackModalProps) {
  const [modal, setModal] = useState<{
    isOpen: boolean;
  }>({
    isOpen: false,
  });
  const [selectedModal, setSelectedModal] = useState({});

  //list of id's of modals that should be ignored
  const [ignoredModals, setIgnoredModals] = useState([]);

  useEffect(() => {
    setSelectedModal({});

    setSelectedModal(
      //loop through al configured modals
      feedbackmodals
        .filter(modal => !ignoredModals.includes(modal.id))
        .filter(modal => {
          if (modal.value.conditions.length > 0 && content.length) {
            //loop through all conditions within modal...
            for (const conditionItem of modal.value.conditions) {

              //kpivalue is the vaule of the assessed validator
              let kpivalue;

              switch (conditionItem.type) {
                case "interactive_input_condition":
                  kpivalue = content?.find(
                    content => content.value?.id == parseFloat(conditionItem.value.parameter)
                  )?.currentValue;
                  break;
                case "kpi_condition":
                  const [level, kpi]: [keyof KPIsByScale, keyof KPIQuad] = conditionItem.value.parameter.split("|");
                  kpivalue = kpis[level][kpi]
                  break;
                case ConditionType.datamodel_query_condition:
                  if (datamodelQueryResults === undefined) {
                    // it's probably still loading
                    return false;
                  }
                  kpivalue = datamodelQueryResults[conditionItem.value.datamodelQueryRule]
                  break;
                case ConditionType.anylogic_output_condition:
                  if (anylogicOutputs === undefined) {
                    // it's probably still loading
                    return false;
                  }
                  kpivalue = anylogicOutputs[snakeToCamel(conditionItem.value.anylogicOutputKey)]
                  break;
                default:
                  throw new Error("Unknown condition type " + conditionItem.type)
              }

              const conditionValue = parseFloat(conditionItem.value.value);

              if (kpivalue == null || kpivalue == undefined) {
                return false;
              } else if (conditionItem.value.operator == "bigger" && kpivalue <= conditionValue) {
                return false;
              } else if (
                conditionItem.value.operator == "biggerequal" &&
                kpivalue < conditionValue
              ) {
                return false;
              } else if (
                conditionItem.value.operator == "equal" &&
                kpivalue?.toString().toLowerCase() != conditionItem.value.value.toLowerCase()
              ) {
                return false;
              } else if (
                conditionItem.value.operator == "notequal" &&
                kpivalue?.toString().toLowerCase() == conditionItem.value.value.toLowerCase()
              ) {
                return false;
              } else if (conditionItem.value.operator == "lower" && kpivalue >= conditionValue) {
                return false;
              } else if (
                conditionItem.value.operator == "lowerequal" &&
                kpivalue > conditionValue
              ) {
                return false;
              } else {
              }
            }
            if (modal.value.modalshowonce) {
              setIgnoredModals(ignoredModals => [...ignoredModals, modal.id]);
            }

            setModal({ isOpen: true });
            return true;
          }
        })[0]
    );
  }, [kpis]);

  function closeModal() {
    setModal({ isOpen: false });
  }

  const modalstyling =
    selectedModal?.value?.modaltheme === "green" ||
    selectedModal?.value?.modaltheme === "greenwithconfetti"
      ? "bg-holon-green"
      : selectedModal?.value?.modaltheme === "orange"
      ? "bg-holon-orange"
      : "bg-holon-red";

  return (
    <Fragment>
      {selectedModal && selectedModal.value && (
        <Transition appear show={modal.isOpen} as={Fragment}>
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
                    className={`w-full p-relative max-w-md min-w-[50vw] transform overflow-hidden rounded p-6 text-center align-middle shadow-xl transition-all text-white flex flex-col gap-4 ${modalstyling}`}>
                    {selectedModal.value.modaltheme === "greenwithconfetti" && <Confetti />}
                    <Dialog.Title as="h2" className="leading-6 text-2xl font-bold">
                      {selectedModal.value.modaltitle}
                    </Dialog.Title>
                    {/* eslint-disable @next/next/no-img-element */}
                    <img
                      src={selectedModal?.value.imageSelector?.img?.src}
                      alt={selectedModal?.value.imageSelector?.img?.alt}
                      className="image"
                      width="1600"
                      height="auto"
                    />
                    <p className="">{selectedModal.value.modaltext}</p>
                    <div className=" flex justify-center">
                      <Button onClick={closeModal} variant="dark" className="mb-0">
                        Ga door
                      </Button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
    </Fragment>
  );
}
