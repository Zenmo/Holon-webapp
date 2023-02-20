import { basePageWrap } from "@/containers/BasePage";
import styles from "./StorylinePage.module.css";
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
  value: StorylineScenario;
};

export type StorylineScenario = {
  id: number;
  name: string;
  description?: string;
  tag: string;
  sliderValueDefault: number;
  sliderValueMin: number;
  sliderValueMax: number;
  sliderLocked: boolean;
};

const StorylinePage = ({ storyline }: { storyline: Storyline[] }) => {
  return (
    <div className={styles["StorylinePage"]}>
      <ContentBlocks content={storyline} />
    </div>
  );
};

export default basePageWrap(StorylinePage);
