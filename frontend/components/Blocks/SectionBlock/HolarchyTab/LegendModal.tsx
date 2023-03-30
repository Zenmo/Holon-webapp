import { Popover } from "@headlessui/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";

type LegendModal = {};

export default function LegendModal() {
  const buttonRef = useRef();

  return (
    <Popover className="relative" data-testid="legend-popover">
      <div className="flex flex-row justify-center">
        <Popover.Button
          className="absolute z-50 flex flex-row top-[-2rem] justify-center items-center text-center px-4 py-2 bg-white active:bg-holon-gray-200 mt-1"
          ref={buttonRef}>
          <div className="inline-block mr-2 w-5">
            <InformationCircleIcon />
          </div>
          Legenda
        </Popover.Button>
      </div>

      <Popover.Panel className="bg-white border-2 border-solid rounded-md border-holon-gray-300">
        <div className="m-4">
          <ul>
            <li>test 1</li>
            <li>test 2</li>
            <li>test 3</li>
            <li>test 4</li>
            <li>test 5</li>
          </ul>
        </div>
      </Popover.Panel>
    </Popover>
  );
}
