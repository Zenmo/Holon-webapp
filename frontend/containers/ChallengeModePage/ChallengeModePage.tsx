import { basePageWrap } from "@/containers/BasePage";
import styles from "./ChallengeModePage.module.css";
import React from "react";

import { PageProps, SectionVariant, TextAndMediaVariant, Graphcolor } from "../types";
import ContentBlocks from "@/components/Blocks/ContentBlocks";
import { FeedbackModal } from "@/components/Blocks/ChallengeFeedbackModal/types";

type Storyline = PageProps<SectionVariant | TextAndMediaVariant>;

export type Feedbackmodals = [FeedbackModal];

const ChallengeModePage = ({
  storyline,
  feedbackmodals,
  graphcolors,
}: {
  storyline: Storyline[];
  feedbackmodals: Feedbackmodals[];
  graphcolors?: Graphcolor[];
}) => {
  return (
    <div className={styles["ChallengeModePage"]}>
      <ContentBlocks
        content={storyline}
        feedbackmodals={feedbackmodals}
        graphcolors={graphcolors ?? []}
        pagetype="Challenge"
      />
    </div>
  );
};

export default basePageWrap(ChallengeModePage);
