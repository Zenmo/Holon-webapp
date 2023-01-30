import React, { Fragment, useEffect, useState, useRef } from "react";
import Confetti from "react-confetti";
import { Dialog, Transition } from "@headlessui/react";
import Button from "@/components/Button/Button";
import styles from "./ChallengeFeedbackModal.module.css";

const modal2 = {
  theme: "red",
  title: "Pas op!!!",
  text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
  image: "https://holonstorage.blob.core.windows.net/media/images/header_holon.width-1600.jpg",
};

const modal1 = {
  theme: "orange",
  title: "Goed gedaan!!!",
  text: "Je hebt het goed gedan!",
  image: "https://holonstorage.blob.core.windows.net/media/images/header_holon.width-1600.jpg",
};

export default function ChallengeFeedbackModal() {
  const [modal, setModal] = useState<{
    isOpen: boolean;
  }>({
    isOpen: true,
  });

  function closeModal() {
    setModal({ isOpen: false });
  }

  const modalstyling =
    modal1.theme === "green"
      ? "bg-holon-green"
      : modal1.theme === "orange"
      ? "bg-holon-orange"
      : "bg-holon-red";

  return (
    <Fragment>
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
                  {modal1.theme === "green" && <Confetti />}

                  <Dialog.Title as="h2" className="leading-6 text-2xl font-bold">
                    {modal1.title}
                  </Dialog.Title>
                  <img layout="fill" src={modal1.image} alt={modal1.title} />
                  <p className="">{modal1.text}</p>
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
    </Fragment>
  );
}
