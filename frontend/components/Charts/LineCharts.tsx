import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ComposedChart,
  Scatter,
} from "recharts";

export default function LineCharts() {
  const [data, setData] = useState([]);
  //   useEffect(() => {
  //     setData([
  //       {
  //         name: "Page A",
  //         uv: 4000,
  //         pv: 2400,
  //         amt: 2400,
  //       },
  //       {
  //         name: "Page B",
  //         uv: -3000,
  //         pv: 1398,
  //         amt: 2210,
  //       },
  //       {
  //         name: "Page C",
  //         uv: -2000,
  //         pv: -9800,
  //         amt: 2290,
  //       },
  //       {
  //         name: "Page D",
  //         uv: 2780,
  //         pv: 3908,
  //         amt: 2000,
  //       },
  //       {
  //         name: "Page E",
  //         uv: -1890,
  //         pv: 4800,
  //         amt: 2181,
  //       },
  //       {
  //         name: "Page F",
  //         uv: 2390,
  //         pv: -3800,
  //         amt: 2500,
  //       },
  //       {
  //         name: "Page G",
  //         uv: 3490,
  //         pv: 4300,
  //         amt: 2100,
  //       },
  //     ]);
  //   }, []);

  const convertGraphData = data => {
    const returnArr = [];
    Object.entries(data).map(value => {
      const constructObj = { ...value[1] };
      constructObj.name = value[0].replace(/['"]+/g, "");
      returnArr.push(constructObj);
    });

    console.log(returnArr);
    return returnArr;
  };

  useEffect(() => {
    const data = {
      Huishouden: {
        Afschrijving: "-60",
        Huishouden: null,
        "Commercieel bedrijf": "0",
        Overheidsinstelling: "0",
        Energieleverancier: "-200",
        Netbeheerder: "-200",
        Overheid: "125",
        "Netto kosten": "-335",
      },
      "Commercieel bedrijf": {
        Afschrijving: "0",
        Huishouden: "0",
        "Commercieel bedrijf": null,
        Overheidsinstelling: "0",
        Energieleverancier: "-200",
        Netbeheerder: "-100",
        Overheid: "-50",
        "Netto kosten": "-350",
      },
      Overheidsinstelling: {
        Afschrijving: "-20",
        Huishouden: "0",
        "Commercieel bedrijf": "0",
        Overheidsinstelling: null,
        Energieleverancier: "-100",
        Netbeheerder: "-200",
        Overheid: "-75",
        "Netto kosten": "-395",
      },
      Energieleverancier: {
        Afschrijving: "0",
        Huishouden: "200",
        "Commercieel bedrijf": "200",
        Overheidsinstelling: "100",
        Energieleverancier: null,
        Netbeheerder: "0",
        Overheid: "0",
        "Netto kosten": "500",
      },
      Netbeheerder: {
        Afschrijving: "-500",
        Huishouden: "200",
        "Commercieel bedrijf": "100",
        Overheidsinstelling: "200",
        Energieleverancier: "0",
        Netbeheerder: null,
        Overheid: "0",
        "Netto kosten": "0",
      },
      Overheid: {
        Afschrijving: "0",
        Huishouden: "-125",
        "Commercieel bedrijf": "50",
        Overheidsinstelling: "75",
        Energieleverancier: "0",
        Netbeheerder: "0",
        Overheid: null,
        "Netto kosten": "0",
      },
    };

    // console.log(convertGraphData(data));
    setData(convertGraphData(data));
  }, []);

  const CustomBarWithTarget = props => {
    const { fill, x, y, width, height, amt, t } = props;

    const totalHeight = y + height;
    const targetY = totalHeight - (height / amt) * t;

    return (
      <svg>
        <line x1={x - (width + 4)} x2={x - 4} y1={y} y2={y} stroke={fill} strokeWidth={8} />
      </svg>
    );
  };

  return (
    <ComposedChart width={1600} height={900} data={data} stackOffset="sign">
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <ReferenceLine y={0} stroke="#000" />

      <Bar dataKey="Afschrijving" fill="green" stackId="stack" />
      <Bar dataKey="Huishouden" fill="blue" stackId="stack" />
      <Bar dataKey="Overheid" fill="lime" stackId="stack" />
      <Bar dataKey="Overheidsinstelling" fill="yellow" stackId="stack" />
      <Bar dataKey="Energieleverancier" fill="purple" stackId="stack" />
      <Bar dataKey="Netbeheerder" fill="pink" stackId="stack" />
      <Bar dataKey="Netto kosten" shape={<CustomBarWithTarget />} fill="red" />
      <Scatter dataKey="Netto kosten" shape="triangle" />
    </ComposedChart>
  );
}
