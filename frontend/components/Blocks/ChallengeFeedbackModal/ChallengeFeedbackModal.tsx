import React, { Fragment, useEffect, useState, useRef } from "react";
import Confetti from "react-confetti";
import { Dialog, Transition } from "@headlessui/react";
import Button from "@/components/Button/Button";
import styles from "./ChallengeFeedbackModal.module.css";
const feedbackmodaljson = require("./staticjson.json");

// const modal2 = {
//   theme: "red",
//   title: "Pas op!!!",
//   text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
//   image: "https://holonstorage.blob.core.windows.net/media/images/header_holon.width-1600.jpg",
// };

// const modal1 = {
//   theme: "orange",
//   title: "Goed gedaan!!!",
//   text: "Je hebt het goed gedan!",
//   image: "https://holonstorage.blob.core.windows.net/media/images/header_holon.width-1600.jpg",
// };

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

export default function ChallengeFeedbackModal({ kpis }: KPIDashboardProps) {
  const [modal, setModal] = useState<{
    isOpen: boolean;
  }>({
    isOpen: true,
  });
  const [selectedModal, setSelectedModal] = useState({});

  useEffect(() => {
    setSelectedModal(
      feedbackmodaljson.feedbackmodals.filter(modal => {
        if (modal.conditions.length > 0) {
          for (const conditionItem of modal.conditions) {
            if (
              conditionItem.operator == "bigger then" &&
              kpis[conditionItem.parameter] > parseFloat(conditionItem.value)
            ) {
              console.log("true1");
              return true;
            } else if (
              conditionItem.operator == "smaller then" &&
              kpis[conditionItem.parameter] < parseFloat(conditionItem.value)
            ) {
              console.log("true2");
              return true;
            } else {
              console.log("false");
              return false;
            }
          }
        }
      })[0]
    );
  }, []);

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
      --{feedbackmodaljson.feedbackmodals[0].modaltitle}--
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
