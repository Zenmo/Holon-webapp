import React, { Fragment, useEffect, useState, useRef } from "react"
import s from "./RawHtml.module.css"
import { Dialog, Transition } from "@headlessui/react"
import { ArrowRightIcon } from "@heroicons/react/24/outline"
import { CloseButton } from "@/components/Button/CloseButton"

export default function RawHtml({ html }: { html: string }) {
    const [modal, setModal] = useState<{
        isOpen: boolean
        modalText: string
        modalLink: string
        modalTitle: string
    }>({
        isOpen: false,
        modalText: "",
        modalLink: "",
        modalTitle: "",
    })

    const RawHtmlItem = useRef(null)

    function closeModal() {
        setModal({ isOpen: false, modalText: "", modalLink: "", modalTitle: "" })
    }

    function openModal(text: string, linkUrl: string, linkTitle: string) {
        setModal({ isOpen: true, modalText: text, modalLink: linkUrl, modalTitle: linkTitle })
    }

    useEffect(() => {
        const wikiLinks = RawHtmlItem.current.querySelectorAll(`a[data-introduction-text]`)

        for (let i = 0; i < wikiLinks.length; i++) {
            const link = wikiLinks[i] as HTMLElement | null
            if (link) {
                link.addEventListener("click", function (e) {
                    e.preventDefault()

                    const linkText = link.getAttribute("data-introduction-text") || ""
                    const linkUrl = link.getAttribute("data-page-link") || ""
                    const linkTitle = link.getAttribute("data-title") || ""
                    openModal(linkText, linkUrl, linkTitle)
                })
            }
        }
    }, [])

    return (
        <Fragment>
            <div
                ref={RawHtmlItem}
                className={s.Container}
                dangerouslySetInnerHTML={{ __html: html }}
            />
            {modal.modalText && (
                <Transition appear show={modal.isOpen} as={Fragment}>
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
                                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded bg-white p-6 text-left align-middle shadow-xl transition-all">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900"
                                        >
                                            {modal.modalTitle}
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                {modal.modalText}
                                            </p>
                                        </div>
                                        <div className="mt-4 flex justify-center">
                                            <a
                                                className={`gap-4 border-holon-blue-900 text-white bg-holon-blue-900 hover:bg-holon-blue-500  inline-flex relative rounded border-2 nowrap px-4 py-3 text-center font-medium leading-5 transition enabled:active:translate-x-holon-bh-x enabled:active:translate-y-holon-bh-y disabled:opacity-50`.trim()}
                                                href={modal.modalLink}
                                                target="_blank"
                                            >
                                                Lees meer
                                                <span className="w-[20px]">
                                                    <ArrowRightIcon />
                                                </span>
                                            </a>
                                        </div>
                                        <CloseButton
                                            onClick={closeModal}
                                            className="w-6 h-6 absolute right-6 top-6 "
                                        />
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            )}
        </Fragment>
    )
}
