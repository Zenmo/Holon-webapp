import { useRef } from "react";
import { Popover } from "@headlessui/react";
import { InformationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type Props = {
  name: string | undefined;
  legal_limitation?: string;
  color?: string;
  titleWikiPage?: string;
  linkWikiPage?: string;
};

export default function InputPopover({
  name,
  legal_limitation,
  color,
  titleWikiPage,
  linkWikiPage,
}: Props) {
  const buttonRef = useRef();

  const selectBackgroundColor = (color: string) => {
    let bgColor = "";
    switch (color) {
      case "red":
        bgColor = "bg-red-100";
        break;
      case "orange":
        bgColor = "bg-orange-100";
        break;
      case "limegreen":
        bgColor = "bg-green-100";
        break;
      default:
        bgColor = "bg-white";
    }
    return bgColor;
  };

  return (
    <Popover className="relative" data-testid="input-popover">
      <Popover.Button className="w-6 h-6 mt-1" ref={buttonRef}>
        <InformationCircleIcon />
      </Popover.Button>

      <Popover.Panel className="absolute z-10 bg-white w-[350px] sm:w-[400px] xl:w-[475px] border-2 border-solid rounded-md border-holon-gray-300 ">
        <div>
          <div className="border-b-2 border-holon-gray-300 mt-4 mx-4 mb-2">
            <h4 className="text-ellipsis overflow-hidden">{name}</h4>
          </div>

          {legal_limitation && (
            <div className="mr-12 ml-4">
              <p className="text-sm">Beleid juridisch toepasbaar</p>
              <div className={`flex items-center rounded-md ${selectBackgroundColor(color)}`}>
                <div className="rounded-full w-2 h-2 m-2" style={{ backgroundColor: color }}></div>
                <p>{legal_limitation}</p>
              </div>
            </div>
          )}
          {linkWikiPage && (
            <div className="mr-12 ml-4 my-4">
              <p className="text-sm">Link naar Wiki-pagina</p>
              {titleWikiPage && <p className="text-lg">{titleWikiPage}</p>}
              <div className="mt-4 flex justify-center">
                <Link href={`/${linkWikiPage}`}>
                  <a
                    className={`gap-4 border-holon-blue-900 text-white bg-holon-blue-900 hover:bg-holon-blue-500  inline-flex relative rounded border-2 nowrap px-4 py-3 text-center font-medium leading-5 transition enabled:active:translate-x-holon-bh-x enabled:active:translate-y-holon-bh-y disabled:opacity-50`.trim()}>
                    Lees meer
                  </a>
                </Link>
              </div>
            </div>
          )}
        </div>
        <button
          onClick={() => buttonRef.current?.click()}
          aria-label="Sluiten"
          className="w-8 h-8 absolute rounded-full right-3 top-3 font-bold">
          <XMarkIcon />
        </button>
      </Popover.Panel>
    </Popover>
  );
}
