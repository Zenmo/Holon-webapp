import React, { Fragment, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { Dialog, Transition } from "@headlessui/react";
import Button from "@/components/Button/Button";
import { FeedbackModal } from "./types";
import { KPIData } from "../../KPIDashboard/types";

type KPIDashboardProps = {
  data: KPIData;
  loading: boolean;
  dashboardId: string;
  feedbackmodals: [FeedbackModal];
};

export default function ChallengeFeedbackModal({
  kpis,
  content,
  feedbackmodals,
}: KPIDashboardProps) {
  const [modal, setModal] = useState<{
    isOpen: boolean;
  }>({
    isOpen: false,
  });
  const [selectedModal, setSelectedModal] = useState({});

  useEffect(() => {
    setSelectedModal({});

    setSelectedModal(
      //loop through al configured modals
      feedbackmodals.filter(modal => {
        if (modal.value.conditions.length > 0 && content.length) {
          //loop through all conditions within modal...
          for (const conditionItem of modal.value.conditions) {
            //split parameter into [local/national] and [kpi]
            const splittedParameter = conditionItem.value.parameter.split("|");

            //kpivalue is the vaule of the assessed validator
            const kpivalue =
              conditionItem.type == "interactive_input_condition"
                ? content?.find(
                    content => content.value.id == parseFloat(conditionItem.value.parameter)
                  ).currentValue
                : kpis[splittedParameter[0]][splittedParameter[1]];

            const conditionValue = parseFloat(conditionItem.value.value);

            if (kpivalue == null || kpivalue == undefined) {
              return false;
            } else if (conditionItem.value.operator == "bigger" && kpivalue <= conditionValue) {
              return false;
            } else if (conditionItem.value.operator == "biggerequal" && kpivalue < conditionValue) {
              return false;
            } else if (
              conditionItem.value.operator == "equal" &&
              kpivalue != conditionItem.value.value
            ) {
              return false;
            } else if (
              conditionItem.value.operator == "notequal" &&
              kpivalue == conditionItem.value.value
            ) {
              return false;
            } else if (conditionItem.value.operator == "lower" && kpivalue >= conditionValue) {
              return false;
            } else if (conditionItem.value.operator == "lowerequal" && kpivalue > conditionValue) {
              return false;
            } else {
            }
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
    selectedModal?.value?.modaltheme === "green"
      ? "bg-holon-green"
      : selectedModal?.value?.modaltheme === "greenwithconfetti"
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
