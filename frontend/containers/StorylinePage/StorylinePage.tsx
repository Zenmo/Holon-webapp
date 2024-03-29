import { basePageWrap } from "@/containers/BasePage";
import styles from "./StorylinePage.module.css";

import ContentBlocks from "@/components/Blocks/ContentBlocks";
import { ScenarioContext } from "context/ScenarioContext";
import { Graphcolor, PageProps, SectionVariant, TextAndMediaVariant, WikiLinks } from "../types";

type Storyline = PageProps<SectionVariant | TextAndMediaVariant>;

const StorylinePage = ({
  storyline,
  scenario,
  graphcolors,
  wikiLinks,
  title,
}: {
  storyline: Storyline[];
  scenario: number;
  graphcolors: Graphcolor[];
  wikiLinks: WikiLinks[];
  title: string;
}) => {
  return (
    <div className={styles["StorylinePage"]}>
      <ScenarioContext.Provider value={scenario}>
        <ContentBlocks
          content={storyline}
          pagetitle={title}
          wikilinks={wikiLinks}
          graphcolors={graphcolors ?? []}
          pagetype={"Storyline"}
        />
      </ScenarioContext.Provider>
    </div>
  );
};

export default basePageWrap(StorylinePage);
