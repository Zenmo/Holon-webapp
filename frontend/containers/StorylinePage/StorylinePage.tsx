import React, { useState, useEffect } from "react";
import StorylineScenario from "@/components/Storyline/StorylineScenario";

import styles from "./StorylinePage.module.css";

const StorylinePage = ({ storyline }) => {
  const [scenarioData, setScenarioData] = useState([]);

  useEffect(() => {
    if (storyline) {
      const sliderArray: [] = [];
      storyline.map(st => {
        if (st.type === "section") {
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
      <div className="flex flex-col lg:flex-row">
        {/* <h1>{exampledata.title}</h1>
        <p>{exampledata.description}</p> */}
      </div>

      <StorylineScenario storylineScenario={scenarioData} />
    </div>
  );
};

export default StorylinePage;
