import { basePageWrap } from "@/containers/BasePage";
import styles from "./ChallengeModePage.module.css";
import React from "react";

import { PageProps, SectionVariant, TextAndMediaVariant } from "../types";
import ContentBlocks from "@/components/Blocks/ContentBlocks";
import { FeedbackModal } from "@/components/Blocks/ChallengeFeedbackModal/types";

type Storyline = PageProps<SectionVariant | TextAndMediaVariant>;

export type Feedbackmodals = [FeedbackModal];

const ChallengeModePage = ({
  storyline,
  feedbackmodals,
}: {
  storyline: Storyline[];
  feedbackmodals: Feedbackmodals[];
}) => {
  return (
    <div className={styles["ChallengeModePage"]}>
      <ContentBlocks content={storyline} feedbackmodals={feedbackmodals} />
    </div>
  );
};

export default basePageWrap(ChallengeModePage);
