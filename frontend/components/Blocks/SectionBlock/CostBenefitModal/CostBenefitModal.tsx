import KostenBatenChart from "@/components/Charts/KostenBatenChart";
import { Tab } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";

export default function CostBenefitModal({ handleClose }: { handleClose: () => void }) {
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    handleClose();
  };

  return (
    <div className="h-screen bg-white">
      <div className="bg-white py-6 px-10 lg:px-16 fixed top-[4.5rem] md:top-28 inset-x-0 mx-auto h-[calc(100%-4.5rem)] md:h-[calc(100%-7rem)] z-20">
        <div className="block h-full w-full">
          <div className="flex flex-1 flex-col h-full">
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
              <Tab.Panels className="flex flex-1 h-full flex-col">
                <Tab.Panel className="flex flex-1 h-full flex-col">
                  <h1 className="text-center">Kosten en baten per segment</h1>
                  <KostenBatenChart />
                </Tab.Panel>
                <Tab.Panel>Content 2</Tab.Panel>
                <Tab.Panel>Content 3</Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </div>
    </div>
  );
}
