import React from "react";

import Card from "@/components/Card/Card";
import { basePageWrap } from "@/containers/BasePage";
import HeroBlock from "@/components/Blocks/HeroBlock/HeroBlock";
import HeaderFullImageBlock from "@/components/Blocks/HeaderFullImageBlock/HeaderFullImageBlock";
import CardBlock from "@/components/Blocks/CardsBlock/CardBlock";
import TitleBlock from "@/components/Blocks/TitleBlock/TitleBlock";
import TextAndMediaBlock from "@/components/Blocks/TextAndMediaBlock/TextAndMediaBlock";
import ParagraphBlock from "@/components/Blocks/ParagraphBlock/ParagraphBlock";
import TableBlock from "@/components/Blocks/TableBlock/TableBlock";
import { PageProps, TextAndMediaVariant, TitleBlockVariant, CardBlockVariant } from "../types";

type Content = PageProps<TextAndMediaVariant | TitleBlockVariant | CardBlockVariant>;

const BestPracticeOverviewPage = ({
  hero,
  content,
  childPractices,
}: {
  hero: any[];
  content: Content[];
  childPractices: any[];
}) => {
  return (
    <React.Fragment>
      {hero?.map(contentItem => {
        switch (contentItem.type) {
          case "header_full_image_block":
            return <HeaderFullImageBlock key={`headerfull ${contentItem.id}`} data={contentItem} />;
          case "hero_block":
            return <HeroBlock key={`heroblock ${contentItem.id}`} data={contentItem} />;
          default:
            null;
        }
      })}
      {content?.map(contentItem => {
        switch (contentItem.type) {
          case "header_full_image_block":
            return <HeaderFullImageBlock key={`headerfull ${contentItem.id}`} data={contentItem} />;
          case "text_image_block":
            return <TextAndMediaBlock key={`txtmedia ${contentItem.id}`} data={contentItem} />;
          case "title_block":
            return <TitleBlock key={`titleblock ${contentItem.id}`} data={contentItem} />;
          case "card_block":
            return <CardBlock key={`cardsblock ${contentItem.id}`} data={contentItem} />;
          case "paragraph_block":
            return <ParagraphBlock key={`paragraphBlock ${contentItem.id}`} data={contentItem} />;
          case "table_block":
            return (
              <div className="holonContentContainer defaultBlockPadding">
                <TableBlock key={`tableBlock ${contentItem.id}`} data={contentItem} />;
              </div>
            );
          default:
            null;
        }
      })}
      <div className="holonContentContainer">
        <div className="defaultBlockPadding">
          <div className="flex flex-row gap-4">
            {childPractices?.map((practice: any, index: number) => {
              return (
                <div
                  key={index}
                  className="px-[1rem] flex-[0_0_50%] sm:flex-[0_0_33%] lg:flex-[0_0_25%] xl:flex-[0_0_20%]">
                  <Card cardItem={practice} cardType="storylineCard" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default basePageWrap(BestPracticeOverviewPage);
