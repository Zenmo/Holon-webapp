import React, { Fragment, useEffect, useState, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import s from "./RawHtml.module.css";
import HolonButton from "../VersionOne/Buttons/HolonButton";
import { Dialog, Transition } from "@headlessui/react";

export default function RawHtml({ html }: { html: string }) {
  const [isOpen, setIsOpen] = useState(true);
  const [modalText, setModalText] = useState("");
  const [modalLink, setModalLink] = useState("");

  const RawHtmlItem = useRef(null);

  function closeModal() {
    setIsOpen(false);
    setModalText("");
    setModalLink("");
  }

  function openModal(text, linkUrl) {
    setModalLink(linkUrl);
    setModalText(text);
    setIsOpen(true);
  }

  useEffect(() => {
    const staticTermLinks = RawHtmlItem.current.querySelectorAll(`a[data-introduction-text]`);

    for (let i = 0; i < staticTermLinks.length; i++) {
      const link = staticTermLinks[i] as HTMLElement | null;
      if (link) {
        link.addEventListener("click", function (e) {
          e.preventDefault();

          const linkText = link.getAttribute("data-introduction-text");
          const linkUrl = link.getAttribute("data-page-link");
          openModal(linkText, linkUrl);
        });
      }
    }
  }, []);

  return (
    <Fragment>
      <div ref={RawHtmlItem} className={s.Container} dangerouslySetInnerHTML={{ __html: html }} />
      {modalText && (
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
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                      Modal voor extra toelichting
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{modalText}</p>
                    </div>
                    <div className="mt-4">
                      <HolonButton tag="a" href={modalLink} variant="darkmode">
                        Lees meer
                      </HolonButton>
                    </div>
                    <button
                      onClick={closeModal}
                      className="w-6 h-6 absolute rounded-full right-6 top-6 ">
                      <XMarkIcon />
                    </button>
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
