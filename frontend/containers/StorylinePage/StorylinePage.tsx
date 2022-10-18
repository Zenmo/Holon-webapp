import React, { useState, useEffect } from "react";
import SolarpanelsAndWindmills from "@/components/ScenariosV2/SolarpanelsAndWindmills";

import styles from "./StorylinePage.module.css";
import TextAndMedia from "@/components/ScenariosV2/TextAndMedia";

const StorylinePage = ({ storyline }) => {
  const [scenarioData, setScenarioData] = useState([]);

  useEffect(() => {
    if (storyline) {
      const sliderArray: [] = [];
      storyline.map(st => {
        if (st.type === "scenario") {
          st.value.content.map(section => {
            if (section.type === "slider") {
              sliderArray.push(section);
            }
          });
        }
      });
      setScenarioData(sliderArray);
    }
  }, [storyline]);

  return (
    <div className={styles["StorylinePage"]}>
      {storyline.map((content, _index) => {
        switch (content.type) {
          case "text_and_media":
            return <TextAndMedia key={`txtmedia ${_index}`} data={content} />;
            break;
          case "scenario":
            return <SolarpanelsAndWindmills key={`solarwind ${_index}`} data={scenarioData} />;
            break;
          default:
            null;
        }
      })}

      <div className="flex flex-col lg:flex-row">
        {/* <h1>{exampledata.title}</h1>
        <p>{exampledata.description}</p> */}
      </div>
    </div>
  );
};

export default StorylinePage;
