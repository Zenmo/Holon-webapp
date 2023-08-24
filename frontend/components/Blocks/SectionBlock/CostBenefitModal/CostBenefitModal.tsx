import CostBenefitChart from "@/components/CostBenefit/CostBenefitChart";
import CostBenefitDetail from "@/components/CostBenefit/CostBenefitDetail";
import CostBenefitTable from "@/components/CostBenefit/CostBenefitTable";
import InteractiveInputPopover from "@/components/InteractiveInputs/InteractiveInputPopover";
import { Graphcolor, WikiLinks } from "@/containers/types";
import { Tab } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { useEffect, useState } from "react";

export const euroFormatter = new Intl.NumberFormat(
    'nl-NL', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
      maximumSignificantDigits: 4
    })

type Props = {
  handleClose: () => void;
  costBenefitData: {
    detail: Record<string, unknown>;
    overview: Record<string, unknown>;
  };
  graphcolors: Graphcolor[];
  wikilinks?: WikiLinks[];
  pagetitle?: string;
};

export default function CostBenefitModal({
  handleClose,
  costBenefitData,
  graphcolors,
  wikilinks,
  pagetitle,
}: Props) {
  const ignoredLabels = ["name", "Netto kosten"];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [subgroup, setSubgroup] = useState("");

  useEffect(() => {
    costBenefitData.detail && setSubgroup(Object.keys(costBenefitData.detail)[0]);
  }, []);

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
      <div className="bg-white py-6 px-10 lg:px-16 fixed top-[5rem] min-[699px]:top-[5.5rem] inset-x-0 mx-auto h-[calc(100%-5rem)] md:h-[calc(100%-5.5rem)] z-30">
        <div className="block h-full w-full">
          <div className="flex flex-1 flex-col h-full">
            <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
              <div className="flex flex-row justify-between">
                <Tab.List className="xl:w-[28%] flex flex-nowrap flex-row">
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
                  {selectedIndex === 2 && (
                    <div className=" h-full ml-2">
                      {costBenefitData.detail && (
                        <select
                          onChange={e => setSubgroup(e.target.value)}
                          className="bg-white border-[1px] border-holon-slated-blue-900 text-sm focus:ring-holon-slated-blue-300 focus:border-holon-slated-blue-300 h-full w-full">
                          {Object.keys(costBenefitData.detail).map(item => (
                            <option value={item} key={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}
                </Tab.List>
                <div className="flex items-center">
                  <h2>{tabItems[selectedIndex].tabTitle}</h2>
                  {wikilinks
                    ?.filter(wikilink => wikilink.type === "cost_benefit")
                    .map((wikilink, index) => (
                      <div className="ml-2" key={index}>
                        <InteractiveInputPopover
                          key={index}
                          textColor="text-holon-blue-900"
                          name={"Meer informatie"}
                          titleWikiPage={
                            'Meer informatie over Kosten en baten binnen "' + pagetitle + '"'
                          }
                          linkWikiPage={wikilink.value}
                          target="_blank"
                        />
                      </div>
                    ))}
                </div>
                <div className="xl:w-[28%] flex">
                  <button
                    type="button"
                    className="text-holon-blue-900 w-8 ml-auto"
                    onClick={handleClick}>
                    <XMarkIcon />
                  </button>
                </div>
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
                  {subgroup ? (
                    <CostBenefitDetail
                      chartdata={convertGraphData(costBenefitData.detail[subgroup])}
                      //detailData={costBenefitData.detail}
                      detailData={costBenefitData.detail[subgroup]}
                      dataColors={graphcolors ?? []}
                      ignoredLabels={ignoredLabels}
                    />
                  ) : (
                    <p>Er is geen data om te tonen</p>
                  )}
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </div>
    </div>
  );
}
