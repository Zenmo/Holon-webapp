import React from "react";
import StorylineOverview from "@/components/Storyline/StorylineOverview/StorylineOverview";
import styles from "./StorylineOverviewPage.module.css";
import { basePageWrap } from "../BasePage";

type Props = Pick<
  React.ComponentProps<typeof StorylineOverview>,
  "allInformationTypes" | "allRoles"
> & {
  allStorylines: React.ComponentProps<typeof StorylineOverview>["storylines"];
};

const StorylineOverviewPage = ({ allInformationTypes, allRoles, allStorylines }: Props) => {
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
