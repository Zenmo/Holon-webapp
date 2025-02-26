import { Popover } from "@headlessui/react"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { CSSProperties, useLayoutEffect, useRef, useState } from "react"
import { CloseButton } from "@/components/Button/CloseButton"

type Props = {
    name: string | undefined
    moreInformation?: string
    legal_limitation?: string
    color?: string
    textColor?: string
    titleWikiPage?: string
    linkWikiPage?: string
    target?: string
    style?: CSSProperties
    popoverHorizontalPosition?: PopoverHorizontalPosition
}

export enum PopoverHorizontalPosition {
    LEFT = "LEFT",
    RIGHT = "RIGHT",
}

export default function InteractiveInputPopover({
    name,
    moreInformation,
    legal_limitation,
    color,
    textColor,
    titleWikiPage,
    linkWikiPage,
    target,
    style,
    popoverHorizontalPosition,
}: Props) {
    const buttonRef = useRef<HTMLButtonElement>()

    const selectBackgroundColor = (color: string) => {
        let bgColor = ""
        switch (color) {
            case "red":
                bgColor = "bg-red-100"
                break
            case "orange":
                bgColor = "bg-orange-100"
                break
            case "limegreen":
                bgColor = "bg-green-100"
                break
            default:
                bgColor =
                    "bg-white border-holon-gray-300 border-2 border-solid rounded-md border-holon-gray-300"
        }
        return bgColor
    }

    const [popoverHorizontalPositionState, setPopoverHorizontalPositionState] = useState(
        popoverHorizontalPosition ?? PopoverHorizontalPosition.RIGHT,
    )
    useLayoutEffect(() => {
        if (popoverHorizontalPosition) {
            return
        }
        const { left } = buttonRef.current.getBoundingClientRect()
        if (left / window.innerWidth < 0.5) {
            // This element is on left half of the screen.
            // Let the popover flow to the right.
            setPopoverHorizontalPositionState(PopoverHorizontalPosition.RIGHT)
        } else {
            setPopoverHorizontalPositionState(PopoverHorizontalPosition.LEFT)
        }
    }, [])

    const selectPopoverLocationStyle = () => {
        if (popoverHorizontalPositionState == PopoverHorizontalPosition.LEFT) {
            return { right: 0 }
        } else {
            return {} // equivalent to left: 0
        }
    }

    return (
        <Popover className="relative" data-testid="input-popover" style={{ ...style }}>
            <Popover.Button className="w-6 h-6 mt-1" ref={buttonRef}>
                <InformationCircleIcon />
            </Popover.Button>

            <Popover.Panel
                className="absolute z-50 bg-white w-[350px] sm:w-[400px] xl:w-[475px] border-2 border-solid rounded-md border-holon-gray-300 "
                style={selectPopoverLocationStyle()}
            >
                <div className={textColor}>
                    <div className=" mt-4 mx-4 mb-2">
                        <h4 className="text-ellipsis overflow-hidden border-b-2 border-holon-gray-300">
                            {name}
                        </h4>
                        {moreInformation && <p className="mt-1 mb-4">{moreInformation}</p>}
                    </div>

                    {legal_limitation && (
                        <div className="mr-12 ml-4 mb-4">
                            <p className="text-sm">Beleid juridisch toepasbaar</p>
                            <div
                                className={`flex items-center rounded-md ${selectBackgroundColor(color)}`}
                            >
                                {color && (
                                    <div
                                        className="rounded-full w-2 h-2 m-2 flex-[0_0_0.5rem]"
                                        style={{ backgroundColor: color }}
                                    ></div>
                                )}
                                <p className="p-1">{legal_limitation}</p>
                            </div>
                        </div>
                    )}
                    {linkWikiPage && (
                        <div className="mr-12 ml-4 mb-4">
                            {titleWikiPage && <p className="text-lg">{titleWikiPage}</p>}
                            <div className="mt-4 flex justify-center">
                                <Link
                                    href={`/${linkWikiPage}`}
                                    target={target && target}
                                    className={`gap-4 border-holon-blue-900 text-white bg-holon-blue-900 hover:bg-holon-blue-500  inline-flex relative rounded border-2 nowrap px-4 py-3 text-center font-medium leading-5 transition enabled:active:translate-x-holon-bh-x enabled:active:translate-y-holon-bh-y disabled:opacity-50`.trim()}
                                >
                                    Lees meer
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
                <CloseButton
                    onClick={() => buttonRef.current?.click()}
                    style={{
                        position: "absolute",
                        right: ".75rem",
                        top: ".75rem",
                    }}
                />
            </Popover.Panel>
        </Popover>
    )
}
