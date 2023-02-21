import React from "react";
import LineCharts from "@/components/Charts/LineCharts";

export default function Tiles() {
  return (
    <div className="flex flex-col justify-center h-full h-screen">
      <h1 className="text-center">Kosten en baten per segment</h1>
      <div className="flex-1">
        <LineCharts />
      </div>
    </div>
  );
}
