import React, { useState, useEffect } from "react";
import StorylineScenario from "@/components/Storyline/StorylineScenario";

import styles from "./StorylinePage.module.css";
import StorylineOverview from "@/components/Storyline/StorylineOverview";

const StorylinePage = ({ id, storyline }) => {
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

      {/* Temporary place to test the storyline cards */}
      <StorylineOverview />
      {/* / Temporary place to test the storyline cards */}
    </div>
  );
};

export default StorylinePage;
