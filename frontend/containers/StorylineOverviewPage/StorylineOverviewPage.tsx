import React from "react";
import StorylineOverview from "@/components/Storyline/StorylineOverview/StorylineOverview";
import CardBlock from "@/components/Blocks/CardsBlock/CardBlock";
import HeroBlock from "@/components/Blocks/HeroBlock/HeroBlock";
import TitleBlock from "@/components/Blocks/TitleBlock/TitleBlock";
import TextAndMediaBlock from "@/components/Blocks/TextAndMediaBlock/TextAndMediaBlock";
import { basePageWrap } from "../BasePage";

import styles from "./StorylineOverviewPage.module.css";

import {
  PageProps,
  TextAndMediaVariant,
  HeroBlockVariant,
  TitleBlockVariant,
  CardBlockVariant,
} from "../types";

type Props = Pick<
  React.ComponentProps<typeof StorylineOverview>,
  "allInformationTypes" | "allRoles"
> & {
  allStorylines: React.ComponentProps<typeof StorylineOverview>["storylines"];
} & PageProps<TextAndMediaVariant | HeroBlockVariant | TitleBlockVariant | CardBlockVariant>;

const StorylineOverviewPage = ({
  intro,
  footer,
  allInformationTypes,
  allRoles,
  allStorylines,
}: Props) => {
  return (
    <div>
      <div className="">
        {intro?.map(contentItem => {
          switch (contentItem.type) {
            case "text_image_block":
              return <TextAndMediaBlock key={`txtmedia ${contentItem.id}`} data={contentItem} />;
            case "hero_block":
              return <HeroBlock key={`heroblock ${contentItem.id}`} data={contentItem} />;
            case "title_block":
              return <TitleBlock key={`titleblock ${contentItem.id}`} data={contentItem} />;
            case "card_block":
              return <CardBlock key={`cardsblock ${contentItem.id}`} data={contentItem} />;
            default:
              null;
          }
        })}
      </div>
      <div className={styles["StorylineOverviewPage"]}>
        <StorylineOverview
          storylines={allStorylines}
          allInformationTypes={allInformationTypes}
          allRoles={allRoles}
        />
      </div>
      <div className="">
        {footer?.map(contentItem => {
          switch (contentItem.type) {
            case "text_image_block":
              return <TextAndMediaBlock key={`txtmedia ${contentItem.id}`} data={contentItem} />;
            case "title_block":
              return <TitleBlock key={`titleblock ${contentItem.id}`} data={contentItem} />;
            case "card_block":
              return <CardBlock key={`cardsblock ${contentItem.id}`} data={contentItem} />;
            default:
              null;
          }
        })}
      </div>
    </div>
  );
};

export default basePageWrap(StorylineOverviewPage);
