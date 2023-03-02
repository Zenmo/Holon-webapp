import React from "react";

import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Label,
  BarChart,
  ResponsiveContainer,
} from "recharts";
import { CostBenefitChartProps } from "./types";

export default function CostBenefitChart({
  chartdata,
  dataColors,
  ignoredLabels,
}: CostBenefitChartProps) {
  const CustomBarWithTarget = props => {
    const { fill, x, y, width } = props;

    return (
      <svg>
        <line x1={x - (width - 30)} x2={x + 30} y1={y} y2={y} stroke={fill} strokeWidth={8} />
      </svg>
    );
  };

  const convertToPositiveEuro = (tickItem: number) => {
    return "€ " + Math.abs(tickItem);
  };

  let columnLabel: string;
  const CustomTooltip = ({ active, payload, label }) => {
    let activeItem = payload.find(label => label.dataKey === columnLabel);
    if (payload.length === 1) {
      // in case, the bar is 0
      activeItem = payload[0];
    }
    if (active && activeItem) {
      return (
        <div className="p-2 z-10 bg-holon-blue-900 border-2 border-solid text-white rounded-md border-holon-gray-300">
          {`${label}${
            activeItem.value < 0
              ? ` betaalt ${convertToPositiveEuro(activeItem.value)}  aan `
              : ` ontvangt ${convertToPositiveEuro(activeItem.value)} van `
          } ${activeItem.name} `}
        </div>
      );
    }
    return null;
  };
  return (
    <React.Fragment>
      {chartdata.length > 0 && (
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart barGap={-40} data={chartdata} stackOffset="sign">
              <CartesianGrid strokeDasharray="2" vertical={false} />
              <XAxis orientation="top" dataKey="name" axisLine={false} />
              <YAxis tickFormatter={convertToPositiveEuro}>
                <Label
                  position="center"
                  angle={-90}
                  value="← Kosten &nbsp;  &nbsp; &nbsp;  Baten &nbsp;  →"
                  offset={-25}
                />
              </YAxis>
              <Tooltip content={<CustomTooltip />} itemSorter={item => item.value} />
              <Legend />
              <ReferenceLine y={0} stroke="#000" />

              {Object.keys(chartdata[0]).map((label, index) => {
                const found = ignoredLabels.find(ilabel => ilabel == label);
                if (!found) {
                  const color = dataColors.find(col => col.name == label) || {
                    name: "default_color",
                    color: "#ffa018",
                  };
                  return (
                    <Bar
                      barSize={60}
                      key={label + index}
                      dataKey={label}
                      fill={color.color}
                      stackId="stack"
                      onMouseOver={() => (columnLabel = label)}
                      onMouseLeave={() => (columnLabel = "")}
                    />
                  );
                }
              })}

              <Bar
                barSize={40}
                dataKey="Netto kosten"
                shape={<CustomBarWithTarget />}
                fill="#FF1818"
                onMouseOver={() => (columnLabel = "Netto kosten")}
                onMouseLeave={() => (columnLabel = "")}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </React.Fragment>
  );
}
