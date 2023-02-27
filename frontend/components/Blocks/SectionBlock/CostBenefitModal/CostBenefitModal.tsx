import { Tab } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import CostBenefitTable from "@/components/Charts/CostBenefitTable";

export default function CostBenefitModal({ handleClose }: { handleClose: () => void }) {
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    handleClose();
  };

  const tabItems = ["Grafiek", "Tabel", "Detail"];

  return (
    <div className="h-screen bg-white">
      <div className="bg-white py-6 px-10 lg:px-16 fixed top-[4.5rem] md:top-28 inset-x-0 mx-auto h-[calc(100%-4.5rem)] md:h-[calc(100%-7rem)] z-20">
        <Tab.Group>
          <div className="flex flex-row justify-between">
            <Tab.List>
              {tabItems.map((tabItem, index) => (
                <Tab
                  key={index}
                  className={({ selected }) =>
                    classNames(
                      "p-3 mr-px ",
                      selected
                        ? "bg-holon-blue-900 text-white"
                        : "bg-holon-gray-200 text-holon-blue-900"
                    )
                  }>
                  {tabItem}
                </Tab>
              ))}
            </Tab.List>
            <button type="button" className="text-holon-blue-900 w-8" onClick={handleClick}>
              <XMarkIcon />
            </button>
          </div>

          <Tab.Panels>
            <Tab.Panel>Content 1</Tab.Panel>
            <Tab.Panel>
              <h2 className="text-center">Kosten en baten per groep</h2>
              <CostBenefitTable></CostBenefitTable>
            </Tab.Panel>
            <Tab.Panel>Content 3</Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
