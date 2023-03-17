import { basePageWrap } from "@/containers/BasePage";
import styles from "./ChallengeModePage.module.css";

import { FeedbackModal } from "@/components/Blocks/ChallengeFeedbackModal/types";
import ContentBlocks from "@/components/Blocks/ContentBlocks";
import { ScenarioContext } from "context/ScenarioContext";
import { Graphcolor, PageProps, SectionVariant, TextAndMediaVariant } from "../types";

type Storyline = PageProps<SectionVariant | TextAndMediaVariant>;

export type Feedbackmodals = [FeedbackModal];

const ChallengeModePage = ({
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
    <div className={styles["ChallengeModePage"]}>
      <ScenarioContext.Provider value={scenario}>
        <ContentBlocks
          content={storyline}
          graphcolors={graphcolors ?? []}
          feedbackmodals={feedbackmodals}
          pagetype="Challenge"
        />
      </ScenarioContext.Provider>
    </div>
  );
};

export default basePageWrap(ChallengeModePage);
