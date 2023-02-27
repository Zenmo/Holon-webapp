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

export default function KostenBatenPerSubtypeChart({ chartdata, dataColors, ignoredLabels }) {
  const CustomBarWithTarget = props => {
    const { fill, x, y, width } = props;

    return (
      <svg>
        <line x1={x - (width - 30)} x2={x + 30} y1={y} y2={y} stroke={fill} strokeWidth={8} />
      </svg>
    );
  };

  const convertToPositiveEuro = tickItem => {
    return "€ " + Math.abs(tickItem);
  };

  const tooltipFormatter = (value, name, props) => {
    return [
      convertToPositiveEuro(value),
      (value < 0 ? "betaalt aan " : "ontvangt van ") + props.dataKey,
    ];
  };

  const tooltipLabelFormatter = tooltipItemLabel => {
    return tooltipItemLabel + ":";
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
              <Tooltip
                itemSorter={item => item.value}
                formatter={tooltipFormatter}
                labelFormatter={tooltipLabelFormatter}
              />
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
                    />
                  );
                }
              })}

              <Bar
                barSize={40}
                dataKey="Netto kosten"
                shape={<CustomBarWithTarget />}
                fill="#FF1818"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </React.Fragment>
  );
}
