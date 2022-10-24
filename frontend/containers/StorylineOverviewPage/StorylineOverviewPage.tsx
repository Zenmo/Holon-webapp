import React from "react";
import StorylineOverview from "@/components/Storyline/StorylineOverview/StorylineOverview";
import styles from "./StorylineOverviewPage.module.css";

const StorylineOverviewPage = ({ storylines }) => {
  console.log(storylines);
  return (
    <div className={styles["StorylineOverviewPage"]}>
      <StorylineOverview storylines={storylines} />
    </div>
  );
};

export default StorylineOverviewPage;
