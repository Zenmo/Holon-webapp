import React, { useState, useEffect } from "react";
import { httpGet } from "@/utils/Http";
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

const API_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

export default function BarCharts() {
  const [data, setData] = useState([]);
  const [dataColors, setDataColors] = useState([]);
  const ignoredLabels = ["name", "Netto kosten"];

  const convertGraphData = (data: Record<string, unknown>) => {
    const returnArr: unknown[] = [];
    Object.entries(data).map(value => {
      const constructObj = { ...value[1] };
      constructObj.name = value[0].replace(/['"]+/g, "");
      returnArr.push(constructObj);
    });

    return returnArr;
  };

  useEffect(() => {
    httpGet("/api/dummy-kosten-baten")
      .then(data => setData(convertGraphData(data)))
      .catch(err => console.log(err));

    httpGet(`${API_URL}/wt/api/nextjs/v1/graph-colors/`)
      .then(result => setDataColors(result.items))
      .catch(err => console.log(err));
  }, []);

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
      {data.length > 0 && (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart barGap={-40} data={data} stackOffset="sign">
            <CartesianGrid strokeDasharray="2" vertical={false} />
            <XAxis orientation="top" dataKey="name" axisLine={false} />
            <YAxis tickFormatter={convertToPositiveEuro}>
              <Label position="top" angle={-90} value="Baten →" offset={-300} />
              <Label position="bottom" angle={-90} value="← Kosten" offset={-300} />
            </YAxis>
            <Tooltip
              itemSorter={item => item.value}
              formatter={tooltipFormatter}
              labelFormatter={tooltipLabelFormatter}
            />
            <Legend />
            <ReferenceLine y={0} stroke="#000" />

            {Object.keys(data[0]).map((label, _index) => {
              const found = ignoredLabels.find(ilabel => ilabel == label);
              if (!found) {
                const color = dataColors.find(col => col.name == label) || {
                  name: "default_color",
                  color: "#ffa018",
                };
                return (
                  <Bar
                    barSize={60}
                    key={_index}
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
      )}
    </React.Fragment>
  );
}
