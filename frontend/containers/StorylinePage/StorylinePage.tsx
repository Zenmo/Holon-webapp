import { basePageWrap } from "@/containers/BasePage";
import SectionBlock from "@/components/Blocks/SectionBlock/SectionBlock";
import TextAndMediaBlock from "@/components/Blocks/TextAndMediaBlock/TextAndMediaBlock";
import CardBlock from "@/components/Blocks/CardsBlock/CardBlock";
import HeroBlock from "@/components/Blocks/HeroBlock/HeroBlock";
import TitleBlock from "@/components/Blocks/TitleBlock/TitleBlock";
import HeaderFullImageBlock from "@/components/Blocks/HeaderFullImageBlock/HeaderFullImageBlock";

import styles from "./StorylinePage.module.css";
import React from "react";

import { PageProps, SectionVariant, TextAndMediaVariant } from "../types";

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
      {storyline?.map((content, _index) => {
        switch (content.type) {
          case "header_full_image":
            return <HeaderFullImageBlock key={`headerFull ${_index}`} data={content} />;
            break;
          case "heroblock":
            return <HeroBlock key={`heroblock ${_index}`} data={content} />;
            break;
          case "title_block":
            return <TitleBlock key={`titleblock ${_index}`} data={content} />;
            break;
          case "card_block":
            return <CardBlock key={`cardsblock ${_index}`} data={content} />;
            break;
          case "text_and_media":
            return <TextAndMediaBlock key={`txtmedia ${_index}`} data={content} />;
            break;
          case "section":
            return <SectionBlock key={`section ${_index}`} data={content} />;
            break;
          default:
            null;
        }
      })}
    </div>
  );
};

export default basePageWrap(StorylinePage);
