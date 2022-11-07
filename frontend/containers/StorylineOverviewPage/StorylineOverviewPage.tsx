import React from "react";
import StorylineOverview from "@/components/Storyline/StorylineOverview/StorylineOverview";
import styles from "./StorylineOverviewPage.module.css";
import { basePageWrap } from "../BasePage";

const StorylineOverviewPage = ({ allInformationTypes, allRoles, allStorylines }) => {
  return (
    <div className={styles["StorylineOverviewPage"]}>
      <StorylineOverview
        storylines={allStorylines}
        allInformationTypes={allInformationTypes}
        allRoles={allRoles}
      />
    </div>
  );
};

export default basePageWrap(StorylineOverviewPage);
