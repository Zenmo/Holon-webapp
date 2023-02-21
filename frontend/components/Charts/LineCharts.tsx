import React, { useState, useEffect } from "react";
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

export default function LineCharts() {
  const [data, setData] = useState([]);

  const convertGraphData = data => {
    const returnArr = [];
    Object.entries(data).map(value => {
      const constructObj = { ...value[1] };
      constructObj.name = value[0].replace(/['"]+/g, "");
      returnArr.push(constructObj);
    });

    return returnArr;
  };

  useEffect(() => {
    fetch("/api/dummy-kosten-baten")
      .then(res => res.json())
      .then(data => setData(convertGraphData(data)))
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

  const ignoredLabels = ["name", "Netto kosten"];
  const colors = [
    "#B9A683",
    "#FFA018",
    "#697260",
    "#C7C28C",
    "#B9A683",
    "#FFA018",
    "#697260",
    "#C7C28C",
    "#B9A683",
    "#FFA018",
    "#697260",
    "#C7C28C",
    "#B9A683",
    "#FFA018",
    "#697260",
    "#C7C28C",
  ];

  const convertToPositive = tickItem => {
    return Math.abs(tickItem);
  };

  const tooltipFormatter = tooltipItemLabel => {
    return tooltipItemLabel + " betaalt:";
  };

  return (
    <React.Fragment>
      {data.length > 0 && (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart barGap={-40} data={data} stackOffset="sign">
            <CartesianGrid strokeDasharray="2" vertical={false} />
            <XAxis orientation="top" dataKey="name" axisLine={false} />
            <YAxis tickFormatter={convertToPositive}>
              <Label position="top" angle={-90} value="Baten →" offset={-300} />
              <Label position="bottom" angle={-90} value="← Kosten" offset={-300} />
            </YAxis>
            <Tooltip labelFormatter={tooltipFormatter} formatter={convertToPositive} />
            <Legend />
            <ReferenceLine y={0} stroke="#000" />

            {Object.keys(data[0]).map((label, _index) => {
              const found = ignoredLabels.find(ilabel => ilabel == label);
              if (!found) {
                return (
                  <Bar
                    barSize={60}
                    key={_index}
                    dataKey={label}
                    fill={colors[_index]}
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
