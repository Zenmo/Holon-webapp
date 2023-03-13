import { basePageWrap } from "@/containers/BasePage";
import styles from "./StorylinePage.module.css";
import React, { createContext } from "react";

import { PageProps, SectionVariant, TextAndMediaVariant, Graphcolor } from "../types";
import ContentBlocks from "@/components/Blocks/ContentBlocks";

type Storyline = PageProps<SectionVariant | TextAndMediaVariant>;

export const ScenarioContext = createContext(0);

const StorylinePage = ({
  storyline,
  scenario,
  graphcolors,
}: {
  storyline: Storyline[];
  scenario: number;
  graphcolors?: Graphcolor[];
}) => {
  return (
    <div className={styles["StorylinePage"]}>
      <ScenarioContext.Provider value={scenario}>
        <ContentBlocks content={storyline} graphcolors={graphcolors ?? []} pagetype={"Storyline"} />
      </ScenarioContext.Provider>
    </div>
  );
};

export default basePageWrap(StorylinePage);
