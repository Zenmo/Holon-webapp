import { Tab } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";

export default function CostBenefitModal({ handleClose }: { handleClose: () => void }) {
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    handleClose();
  };

  return (
    <div className="h-screen w-full bg-white ">
      <div className="bg-white w-full  py-6 px-10 lg:px-16 fixed top-[4.5rem] md:top-28 inset-x-0 mx-auto h-[calc(100%-4.5rem)] md:h-[calc(100%-7rem)] z-10">
        <Tab.Group>
          <div className="flex flex-row justify-between">
            <Tab.List>
              <Tab
                className={({ selected }) =>
                  classNames(
                    "p-3 mr-px ",
                    selected
                      ? "bg-holon-blue-900 text-white"
                      : "bg-holon-gray-200 text-holon-blue-900"
                  )
                }>
                Grafiek
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    "p-3 mr-px",
                    selected
                      ? "bg-holon-blue-900 text-white"
                      : "bg-holon-gray-200 text-holon-blue-900"
                  )
                }>
                Tabel
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    "p-3 ",
                    selected
                      ? "bg-holon-blue-900 text-white"
                      : "bg-holon-gray-200 text-holon-blue-900"
                  )
                }>
                Detail
              </Tab>
            </Tab.List>
            <button type="button" className="text-holon-blue-900 w-8" onClick={handleClick}>
              <XMarkIcon />
            </button>
          </div>

          <Tab.Panels>
            <Tab.Panel>Content 1</Tab.Panel>
            <Tab.Panel>Content 2</Tab.Panel>
            <Tab.Panel>Content 3</Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
