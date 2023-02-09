import CardBlock from "./CardsBlock/CardBlock";
import HeroBlock from "./HeroBlock/HeroBlock";
import TitleBlock from "./TitleBlock/TitleBlock";
import TextAndMediaBlock from "./TextAndMediaBlock/TextAndMediaBlock";
import ButtonsAndMediaBlock from "./ButtonsAndMediaBlock/ButtonsAndMediaBlock";

import {
  PageProps,
  TextAndMediaVariant,
  HeroBlockVariant,
  TitleBlockVariant,
  CardBlockVariant,
} from "../../containers/types";
import React from "react";
import HeaderFullImageBlock from "./HeaderFullImageBlock/HeaderFullImageBlock";
import ParagraphBlock from "./ParagraphBlock";
import TableBlock from "./TableBlock/TableBlock";
import SectionBlock from "./SectionBlock/SectionBlock";

export type Feedbackmodals = [
  {
    id: string;
    type: string;
    value: {
      modaltitle: string;
      modaltext: string;
      modaltheme: string;
      imageSelector: {
        id: string;
        title: string;
        img: any;
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

type ContentBlockProps = PageProps<
  TextAndMediaVariant | HeroBlockVariant | TitleBlockVariant | CardBlockVariant
>;

const ContentBlocks = ({ content, feedbackmodals }: { content: ContentBlockProps[]; feedbackmodals: Feedbackmodals[]; }) => {
  return (
    <React.Fragment>
      {content?.map(contentItem => {
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
            return <SectionBlock key={`section ${contentItem.id}`} data={contentItem}  feedbackmodals={feedbackmodals} />;
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
