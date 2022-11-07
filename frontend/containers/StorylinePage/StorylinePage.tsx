import { basePageWrap } from "@/containers/BasePage";
import Section from "@/components/Section/Section";
import TextAndMedia from "@/components/TextAndMedia/TextAndMedia";

import styles from "./StorylinePage.module.css";
import React from "react";

export type Storyline = {
  id: string;
  type: string;
  // eslint-disable-next-line
  value: any;
};

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
      {storyline?.map((content, _index) => {
        switch (content.type) {
          case "text_and_media":
            return <TextAndMedia key={`txtmedia ${_index}`} data={content} />;
            break;
          case "section":
            return <Section key={`section ${_index}`} data={content} />;
            break;
          default:
            null;
        }
      })}
    </div>
  );
};

export default basePageWrap(StorylinePage);
