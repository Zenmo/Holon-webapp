import CardBlock from "@/components/Blocks/CardsBlock";
import HeroBlock from "@/components/Blocks/HeroBlock";
import TitleBlock from "@/components/Blocks/TitleBlock";
import Section from "@/components/Section/Section";
import TextAndMedia from "@/components/TextAndMedia";

export type CardBlockVariant = {
  type: "card_block";
} & React.ComponentProps<typeof CardBlock>["data"];

export type HeroBlockVariant = {
  type: "hero_block";
} & React.ComponentProps<typeof HeroBlock>["data"];

export type SectionVariant = {
  type: "section";
} & React.ComponentProps<typeof Section>["data"];

export type TextAndMediaVariant = {
  type: "text_image_block";
} & React.ComponentProps<typeof TextAndMedia>["data"];

export type TitleBlockVariant = {
  type: "title_block";
} & React.ComponentProps<typeof TitleBlock>["data"];

export type PageProps<Types> = {
  id: string;
} & Types;

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
export type StorylineSlider = {
  id: string;
  type: string;
  value: StorylineScenario;
};

export type Scenario = {
  id: string;
  type: string;
  value: { content: StorylineSlider[] };
};