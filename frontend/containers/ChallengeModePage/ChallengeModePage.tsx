import { basePageWrap } from "@/containers/BasePage";
import styles from "./ChallengeModePage.module.css";
import React from "react";

import { PageProps, SectionVariant, TextAndMediaVariant } from "../types";
import ContentBlocks from "@/components/Blocks/ContentBlocks";

type Storyline = PageProps<SectionVariant | TextAndMediaVariant>;

export type Feedbackmodals = [
  {
    id: string;
    type: string;
    value: {
      modaltitle: string;
      modaltext: string;
      modaltheme: string;
      imageSelector: {
        id: number;
        title: string;
        img: {
          src: string;
          width: number;
          height: number;
          alt: string;
        };
      };
    };
    conditions: [
      {
        id: string;
        type: string;
        value: {
          parameter: string;
          oparator: string;
          value: string;
        };
      }
    ];
  }
];

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

const ChallengeModePage = ({
  storyline,
  feedbackmodals,
}: {
  storyline: Storyline[];
  feedbackmodals: Feedbackmodals[];
}) => {
  return (
    <div className={styles["ChallengeModePage"]}>
      <ContentBlocks content={storyline} feedbackmodals={feedbackmodals} pagetype="Challenge" />
    </div>
  );
};

export default basePageWrap(ChallengeModePage);
