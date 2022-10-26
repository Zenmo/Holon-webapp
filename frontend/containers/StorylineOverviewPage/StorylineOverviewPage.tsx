import React from "react";
import StorylineOverview from "@/components/Storyline/StorylineOverview/StorylineOverview";
import styles from "./StorylineOverviewPage.module.css";

const StorylineOverviewPage = ({ allInformationTypes, allRoles, storylines }) => {
  return (
    <div className={styles["StorylineOverviewPage"]}>
      <StorylineOverview
        storylines={storylines}
        allInformationTypes={allInformationTypes}
        allRoles={allRoles}
      />
    </div>
  );
};

export default StorylineOverviewPage;
