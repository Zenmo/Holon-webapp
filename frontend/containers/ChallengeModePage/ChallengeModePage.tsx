import { basePageWrap } from "@/containers/BasePage";
import styles from "./ChallengeModePage.module.css";
import React from "react";

import { PageProps, SectionVariant, TextAndMediaVariant } from "../types";
import ContentBlocks from "@/components/Blocks/ContentBlocks";

type Storyline = PageProps<SectionVariant | TextAndMediaVariant>;

export type Scenario = {
  id: string;
  type: string;
  value: { content: Slider[] };
};

export type Slider = {
  id: string;
  type: string;
  value: ChallengeModeScenario;
};

export type ChallengeModeScenario = {
  id: number;
  name: string;
  description?: string;
  tag: string;
  sliderValueDefault: number;
  sliderValueMin: number;
  sliderValueMax: number;
  sliderLocked: boolean;
};

const ChallengeModePage = ({ storyline }: { storyline: Storyline[] }) => {
  return (
    <div className={styles["ChallengeModePage"]}>
      <ContentBlocks content={storyline} pagetype="Challenge" />
    </div>
  );
};

export default basePageWrap(ChallengeModePage);
