import { Popover } from "@headlessui/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";

type LegendModal = {};

export default function LegendModal() {
  const buttonRef = useRef();

  return (
    <Popover
      className="absolute z-10 translate-x-[-50%] left-1/2 top-[-2rem]"
      data-testid="legend-popover">
      <Popover.Button className="flex flex-row bg-holon-blue-500 mt-1" ref={buttonRef}>
        <InformationCircleIcon /> Legenda
      </Popover.Button>

      <Popover.Panel className="absolute z-10 bg-white w-[350px] sm:w-[400px] xl:w-[475px] border-2 border-solid rounded-md border-holon-gray-300 ">
        <div></div>
      </Popover.Panel>
    </Popover>
  );
}
