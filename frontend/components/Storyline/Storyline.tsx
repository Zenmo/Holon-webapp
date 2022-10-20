// import { useState } from "react";
// //http://localhost:8000/wt/api/nextjs/v1/pages/8/
import RawHtml from "../RawHtml";
import exampledata from "./exampledata.json";
import StorylineScenario from "./StorylineScenario";

export default function Storyline() {
  return (
    <>
      <div className="flex flex-col lg:flex-row">
        <h1>{exampledata.title}</h1>
        <p>
          <RawHtml html={exampledata.description} />
        </p>
      </div>
      {exampledata.body.map((scenario, index) => (
        <StorylineScenario key={index} storylineScenario={scenario} />
      ))}
    </>
  );
}
