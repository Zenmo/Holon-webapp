import React, { Fragment, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { Dialog, Transition } from "@headlessui/react";
import Button from "@/components/Button/Button";

/* eslint-disable */
const feedbackmodaljson = require("./staticjson.json");

type KPIDashboardProps = {
  data: Data;
  loading: boolean;
  dashboardId: string;
};

type Data = {
  local: {
    netload: number;
    costs: number;
    sustainability: number;
    selfSufficiency: number;
  };
  national: {
    netload: number;
    costs: number;
    sustainability: number;
    selfSufficiency: number;
  };
};

export default function ChallengeFeedbackModal({ kpis, content }: KPIDashboardProps) {
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
      feedbackmodaljson.feedbackmodals.filter(modal => {
        if (modal.conditions.length > 0 && content.length) {
          //loop through all conditions within modal...
          for (const conditionItem of modal.conditions) {
            //kpivalue is the vaule of the assessed validator
            const kpivalue = conditionItem.parameter.id
              ? content?.find(content => content.value.id == parseFloat(conditionItem.parameter.id))
                  .currentValue
              : kpis[conditionItem.parameter.level][conditionItem.parameter.parameter];
            console.log(kpivalue, conditionItem.parameter);
            if (kpivalue == null || kpivalue == undefined) {
              return false;
            } else if (
              conditionItem.operator == "bigger" &&
              kpivalue <= parseFloat(conditionItem.value)
            ) {
              console.log(kpivalue + "is not bigger then" + parseFloat(conditionItem.value));
              return false;
            } else if (
              conditionItem.operator == "biggerequal" &&
              kpivalue < parseFloat(conditionItem.value)
            ) {
              console.log(
                kpivalue + "is not bigger or euqyal then" + parseFloat(conditionItem.value)
              );
              return false;
            } else if (conditionItem.operator == "equal" && kpivalue != conditionItem.value) {
              console.log(kpivalue + "is not equal to" + parseFloat(conditionItem.value));
              return false;
            } else if (conditionItem.operator == "notequal" && kpivalue == conditionItem.value) {
              console.log(kpivalue + "is equal to" + parseFloat(conditionItem.value));
              return false;
            } else if (
              conditionItem.operator == "lower" &&
              kpivalue >= parseFloat(conditionItem.value)
            ) {
              console.log(kpivalue + "is not lower then" + parseFloat(conditionItem.value));
              return false;
            } else if (
              conditionItem.operator == "lowerequal" &&
              kpivalue > parseFloat(conditionItem.value)
            ) {
              console.log(
                kpivalue + "is not smaller or equal then" + parseFloat(conditionItem.value)
              );
              return false;
            } else {
            }
          }
          console.log("everything is fine");
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
    selectedModal?.modaltheme === "green"
      ? "bg-holon-green"
      : selectedModal?.modaltheme === "orange"
      ? "bg-holon-orange"
      : "bg-holon-red";

  return (
    <Fragment>
      {selectedModal && (
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
                    {selectedModal.modaltheme === "green" && <Confetti />}
                    <Dialog.Title as="h2" className="leading-6 text-2xl font-bold">
                      {selectedModal.modaltitle}
                    </Dialog.Title>
                    {/* eslint-disable @next/next/no-img-element */}
                    <img
                      src={selectedModal?.image_selector?.img?.src}
                      alt={selectedModal?.image_selector?.img?.alt}
                      className="image"
                      width="1600"
                      height="auto"
                    />
                    <p className="">{selectedModal.modaltext}</p>
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
