import { basePageWrap } from "@/containers/BasePage";
import styles from "./SandboxPage.module.css";

import { FeedbackModal } from "@/components/Blocks/ChallengeFeedbackModal/types";
import ContentBlocks from "@/components/Blocks/ContentBlocks";
import { ScenarioContext } from "context/ScenarioContext";
import { Graphcolor, PageProps, SectionVariant, TextAndMediaVariant } from "../types";

type Storyline = PageProps<SectionVariant | TextAndMediaVariant>;

export type Feedbackmodals = [FeedbackModal];

const SandboxPage = ({
  storyline,
  scenario,
  feedbackmodals,
  graphcolors,
}: {
  storyline: Storyline[];
  scenario: number;
  feedbackmodals: Feedbackmodals[];
  graphcolors: Graphcolor[];
}) => {
  return (
    <div className={styles["SandboxPage"]}>
      <ScenarioContext.Provider value={scenario}>
        <ContentBlocks
          content={storyline}
          graphcolors={graphcolors ?? []}
          feedbackmodals={feedbackmodals}
          pagetype="Sandbox"
        />
      </ScenarioContext.Provider>
    </div>
  );
};

export default basePageWrap(SandboxPage);
