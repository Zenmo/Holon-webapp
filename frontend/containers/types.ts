import CardBlock from "@/components/Blocks/CardsBlock";
import HeroBlock from "@/components/Blocks/HeroBlock";
import TitleBlock from "@/components/Blocks/TitleBlock";
import TextAndMedia from "@/components/TextAndMedia";
import {Background, GridLayout} from "@/components/Blocks/types";
import {Content} from "@/components/Blocks/SectionBlock/types";

export type CardBlockVariant = {
  type: "card_block";
} & React.ComponentProps<typeof CardBlock>["data"];

export type HeroBlockVariant = {
  type: "hero_block";
} & React.ComponentProps<typeof HeroBlock>["data"];

export type SectionVariant = {
  type: "section";
  value: {
    background: Background;
    content: Content[];
    textLabelNational: string;
    textLabelIntermediate: string;
    textLabelLocal: string;
    gridLayout: GridLayout;
    openingSection?: boolean;
  };
  id: string;
};

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

export type Graphcolor = {
  name: string;
  color: string;
}
export type WikiLinks = {
  id: string;
  value: string;
  type: string;
}
