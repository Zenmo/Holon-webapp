import CardBlock from "@/components/Blocks/CardsBlock/CardBlock";
import HeroBlock from "@/components/Blocks/HeroBlock/HeroBlock";
import TitleBlock from "@/components/Blocks/TitleBlock/TitleBlock";
import SolarpanelsAndWindmills from "@/components/Scenarios/SolarpanelsAndWindmills";
import TextAndMedia from "@/components/TextAndMedia/TextAndMedia";
import Header from "@/components/Header/Header";
import { NavItem } from "@/api/types";

import { basePageWrap } from "@/containers/BasePage";

import styles from "./StorylinePage.module.css";
import React from "react";

export type Storyline = {
  id: string;
  type: string;
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

const StorylinePage = ({
  storyline,
  navigation,
}: {
  storyline: Storyline[];
  navigation: NavItem[];
}) => {
  return (
    <div className={styles["StorylinePage"]}>
      {storyline?.map((content, _index) => {
        switch (content.type) {
          case "text_and_media":
            return <TextAndMedia key={`txtmedia ${_index}`} data={content} />;
            break;
          case "section":
            return <SolarpanelsAndWindmills key={`solarwind ${_index}`} data={content} />;
            break;
          case "heroblock":
            return <HeroBlock key={`heroblock ${_index}`} data={content} />;
          case "title_block":
            return <TitleBlock key={`titleblock ${_index}`} data={content} />;
            break;
          case "card_block":
            return <CardBlock key={`cardsblock ${_index}`} data={content} />;
            break;
          default:
            null;
        }
      })}
    </div>
  );
};

export default basePageWrap(StorylinePage);
