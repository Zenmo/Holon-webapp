import ButtonsAndMediaBlock from "./ButtonsAndMediaBlock/ButtonsAndMediaBlock";
import CardBlock from "./CardsBlock/CardBlock";
import HeroBlock from "./HeroBlock/HeroBlock";
import TextAndMediaBlock from "./TextAndMediaBlock/TextAndMediaBlock";
import TitleBlock from "./TitleBlock/TitleBlock";

import React from "react";
import {
  CardBlockVariant,
  Graphcolor,
  HeroBlockVariant,
  PageProps,
  TextAndMediaVariant,
  TitleBlockVariant,
} from "../../containers/types";
import { FeedbackModal } from "./ChallengeFeedbackModal/types";
import HeaderFullImageBlock from "./HeaderFullImageBlock/HeaderFullImageBlock";
import ParagraphBlock from "./ParagraphBlock";
import SectionBlock from "./SectionBlock/SectionBlock";
import TableBlock from "./TableBlock/TableBlock";

export type Feedbackmodals = [FeedbackModal];

type ContentBlockProps = PageProps<
  TextAndMediaVariant | HeroBlockVariant | TitleBlockVariant | CardBlockVariant
>;

const ContentBlocks = ({
  content,
  pagetype,
  feedbackmodals,
  graphcolors,
}: {
  content: ContentBlockProps[];
  feedbackmodals?: Feedbackmodals[];
  pagetype?: string;
  graphcolors?: Graphcolor[];
}) => {
  const targetValueMap = new Map();

  function getTargetValues(blocks, currentIndex) {
    for (let i = 0; i <= currentIndex; i++) {
      if (blocks[i].type === "section") {
        blocks[i].value.content.map(element => {
          if (element.type === "interactive_input" && element.value.targetValue) {
            targetValueMap.set(element.value.id, element.value.targetValue);
          }
        });
      }
    }
  }

  function addTargetValues(values) {
    values.forEach((value, key) => {
      console.log(`dit is de key ${key} en dit is de value ${value}`);
    });
  }

  return (
    <React.Fragment>
      {content?.map((contentItem, index) => {
        switch (contentItem.type) {
          case "header_full_image_block":
            return <HeaderFullImageBlock key={`headerfull ${contentItem.id}`} data={contentItem} />;
          case "paragraph_block":
            return <ParagraphBlock key={`paragraphBlock ${contentItem.id}`} data={contentItem} />;
          case "table_block":
            return (
              <div className="holonContentContainer defaultBlockPadding">
                <TableBlock key={`tableBlock ${contentItem.id}`} data={contentItem} />;
              </div>
            );
          case "text_image_block":
            return <TextAndMediaBlock key={`txtmedia ${contentItem.id}`} data={contentItem} />;
          case "hero_block":
            return <HeroBlock key={`heroblock ${contentItem.id}`} data={contentItem} />;
          case "title_block":
            return <TitleBlock key={`titleblock ${contentItem.id}`} data={contentItem} />;
          case "card_block":
            return <CardBlock key={`cardsblock ${contentItem.id}`} data={contentItem} />;
          case "section":
            getTargetValues(content, index);
            console.log(targetValueMap);
            addTargetValues(targetValueMap);
            return (
              <SectionBlock
                key={`section ${contentItem.id}`}
                data={contentItem}
                pagetype={pagetype}
                feedbackmodals={feedbackmodals}
                graphcolors={graphcolors ?? []}
              />
            );
            break;
          case "buttons_and_media_block":
            return (
              <ButtonsAndMediaBlock key={`buttonsmedia ${contentItem.id}`} data={contentItem} />
            );
          default:
            null;
        }
      })}
    </React.Fragment>
  );
};

export default ContentBlocks;
