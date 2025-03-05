import classNames from "classnames"
import React from "react"
import { Tab } from "@headlessui/react"
import { TableCellsIcon, ChartBarIcon } from "@heroicons/react/24/outline"
import CostBenefitChart from "./CostBenefitChart"
import CostBenefitTable from "./CostBenefitTable"

import { CostBenefitChartProps } from "./types"

export default function CostBenefitDetail({
    chartdata,
    detailData,
    dataColors,
    ignoredLabels,
}: CostBenefitChartProps) {
    const subTabItems = ["Grafiek", "Tabel"]

    return (
        <Tab.Group>
            <Tab.List className="justify-center flex">
                {subTabItems.map((tabItem, index) => (
                    <Tab
                        key={"sub" + tabItem + index}
                        className={({ selected }) =>
                            classNames(
                                "p-1 border-b-4 bg-transparent ",
                                selected ?
                                    "text-holon-blue-900 border-holon-blue-900"
                                :   "border-transparent text-holon-blue-500",
                            )
                        }
                    >
                        <span className="flex flex-row items-center px-2 gap-2">
                            {tabItem == "Grafiek" ?
                                <ChartBarIcon className="w-6" />
                            :   <TableCellsIcon className="w-6" />}
                            {tabItem}
                        </span>
                    </Tab>
                ))}
            </Tab.List>
            <Tab.Panels className="flex flex-1 h-full flex-col min-h-0">
                <Tab.Panel className="flex flex-1 h-full flex-col">
                    <CostBenefitChart
                        chartdata={chartdata}
                        dataColors={dataColors}
                        ignoredLabels={ignoredLabels}
                    />
                </Tab.Panel>
                <Tab.Panel className="flex max-h-full flex-col overflow">
                    <CostBenefitTable tableData={detailData} />
                </Tab.Panel>
            </Tab.Panels>
        </Tab.Group>
    )
}
