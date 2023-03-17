import CostBenefitChart from "@/components/CostBenefit/CostBenefitChart";
import CostBenefitDetail from "@/components/CostBenefit/CostBenefitDetail";
import CostBenefitTable from "@/components/CostBenefit/CostBenefitTable";
import { Graphcolor } from "@/containers/types";
import { Tab } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { useState } from "react";

type Props = {
  handleClose: () => void;
  costBenefitData: {
    detail: Record<string, unknown>;
    overview: Record<string, unknown>;
  };
  graphcolors: Graphcolor[];
};

export default function CostBenefitModal({ handleClose, costBenefitData, graphcolors }: Props) {
  const ignoredLabels = ["name", "Netto kosten"];
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    handleClose();
  };

  const convertGraphData = data => {
    const returnArr: unknown[] = [];
    if (data !== undefined) {
      Object.entries(data).map(value => {
        const constructObj = { ...value[1] };
        constructObj.name = value[0].replace(/['"]+/g, "");
        returnArr.push(constructObj);
      });
    }

    return returnArr;
  };

  const tabItems = [
    { tabName: "Grafiek", tabTitle: "Kosten en baten per categorie" },
    { tabName: "Tabel", tabTitle: "Kosten en baten per categorie" },
    { tabName: "Detail", tabTitle: "Kosten en baten per subcategorie" },
  ];

  return (
    <div className="h-screen bg-white">
      <div className="bg-white py-6 px-10 lg:px-16 fixed top-[4.5rem] md:top-28 inset-x-0 mx-auto h-[calc(100%-4.5rem)] md:h-[calc(100%-7rem)] z-20">
        <div className="block h-full w-full">
          <div className="flex flex-1 flex-col h-full">
            <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
              <div className="flex flex-row justify-between">
                <Tab.List>
                  {tabItems.map((tabItem, index) => (
                    <Tab
                      key={tabItem.tabName + index}
                      className={({ selected }) =>
                        classNames(
                          "p-3 mr-px ",
                          selected
                            ? "bg-holon-blue-900 text-white"
                            : "bg-holon-gray-200 text-holon-blue-900"
                        )
                      }>
                      {tabItem.tabName}
                    </Tab>
                  ))}
                </Tab.List>
                <h2>{tabItems[selectedIndex].tabTitle}</h2>
                <button type="button" className="text-holon-blue-900 w-8" onClick={handleClick}>
                  <XMarkIcon />
                </button>
              </div>

              <Tab.Panels className="flex flex-1 flex-col min-h-0">
                <Tab.Panel className="flex flex-1 max-h-full flex-col pt-2">
                  <CostBenefitChart
                    chartdata={convertGraphData(costBenefitData.overview)}
                    dataColors={graphcolors ?? []}
                    ignoredLabels={ignoredLabels}
                  />
                </Tab.Panel>
                <Tab.Panel className="flex  max-h-full flex-col">
                  <CostBenefitTable tableData={costBenefitData.overview} />
                </Tab.Panel>

                <Tab.Panel className="flex flex-1 flex-col gap-2 min-h-0 pt-2">
                  <CostBenefitDetail
                    chartdata={convertGraphData(costBenefitData.detail)}
                    detailData={costBenefitData.detail}
                    dataColors={graphcolors ?? []}
                    ignoredLabels={ignoredLabels}
                  />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </div>
    </div>
  );
}
