import { useState, useEffect } from "react";
import CostBenefitChart from "@/components/CostBenefit/CostBenefitChart";
import CostBenefitDetail from "@/components/CostBenefit/CostBenefitDetail";
import { Tab } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import {
  getHolonDataSegments,
  getHolonDataSegmentsDetail,
  getHolonGraphColor,
} from "../../../../api/holon";

import CostBenefitTable from "@/components/CostBenefit/CostBenefitTable";

export default function CostBenefitModal({ handleClose }: { handleClose: () => void }) {
  const [data, setData] = useState([]);
  const [detailData, setDetailData] = useState([]);
  const [dataColors, setDataColors] = useState([]);
  const ignoredLabels = ["name", "Netto kosten"];
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    handleClose();
  };

  const convertGraphData = data => {
    const returnArr: unknown[] = [];
    Object.entries(data).map(value => {
      const constructObj = { ...value[1] };
      constructObj.name = value[0].replace(/['"]+/g, "");
      returnArr.push(constructObj);
    });

    return returnArr;
  };

  useEffect(() => {
    getHolonDataSegments()
      .then(data => setData(data))
      .catch(err => console.log(err));

    getHolonDataSegmentsDetail()
      .then(data => setDetailData(data))
      .catch(err => console.log(err));

    getHolonGraphColor()
      .then(result => setDataColors(result.items))
      .catch(err => console.log(err));
  }, []);

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
                    chartdata={convertGraphData(data)}
                    dataColors={dataColors}
                    ignoredLabels={ignoredLabels}
                  />
                </Tab.Panel>
                <Tab.Panel className="flex  max-h-full flex-col pt-2">
                  <CostBenefitTable tableData={data} />
                </Tab.Panel>

                <Tab.Panel className="flex flex-1 flex-col gap-2 min-h-0 pt-2">
                  <CostBenefitDetail
                    chartdata={convertGraphData(data)}
                    detailData={detailData}
                    dataColors={dataColors}
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
