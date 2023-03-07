import { basePageWrap } from "@/containers/BasePage";
import styles from "./StorylinePage.module.css";
import React, { createContext } from "react";

import { PageProps, SectionVariant, TextAndMediaVariant } from "../types";
import ContentBlocks from "@/components/Blocks/ContentBlocks";

type Storyline = PageProps<SectionVariant | TextAndMediaVariant>;

export const ScenarioContext = createContext(0);

const StorylinePage = ({ storyline, scenario }: { storyline: Storyline[]; scenario: number }) => {
  return (
    <div className={styles["StorylinePage"]}>
      <ScenarioContext.Provider value={scenario}>
        <ContentBlocks content={storyline} pagetype={"Storyline"} />
      </ScenarioContext.Provider>
    </div>
  );
};

export default basePageWrap(StorylinePage);
