import { basePageWrap } from "@/containers/BasePage";
import styles from "./ChallengeModePage.module.css";

import { FeedbackModal } from "@/components/Blocks/ChallengeFeedbackModal/types";
import ContentBlocks from "@/components/Blocks/ContentBlocks";
import { Graphcolor, PageProps, SectionVariant, TextAndMediaVariant } from "../types";

type Storyline = PageProps<SectionVariant | TextAndMediaVariant>;

export type Feedbackmodals = [FeedbackModal];

const ChallengeModePage = ({
  storyline,
  feedbackmodals,
  graphcolors,
}: {
  storyline: Storyline[];
  feedbackmodals: Feedbackmodals[];
  graphcolors: Graphcolor[];
}) => {
  return (
    <div className={styles["ChallengeModePage"]}>
      <ContentBlocks
        content={storyline}
        graphcolors={graphcolors ?? []}
        feedbackmodals={feedbackmodals}
        pagetype="Challenge"
      />
    </div>
  );
};

export default basePageWrap(ChallengeModePage);
