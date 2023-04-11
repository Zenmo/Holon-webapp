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
  /*loops through all sections above on the page and if there is an interactive element with a target value, it saves it and gives it back. Alternative: globally save it in a variable and only loop through current section and create a new copy of the variable if a new targetvalue is added or one has changed*/
  function getTargetValues(blocks, currentIndex) {
    const targetValueMap = new Map();
    for (let i = 0; i <= currentIndex; i++) {
      if (blocks[i].type === "section") {
        blocks[i].value.content.map(element => {
          if (element.type === "interactive_input" && element.value.targetValue) {
            targetValueMap.set(element.value.id, element.value);
          }
        });
      }
    }
    return targetValueMap;
  }

  function addTargetValues(values, content) {
    const updatedContent = { ...content };
    values.forEach((value, key) => {
      content.value.content.map(element => {
        if (key === element.value.id) {
          //console.log("element gevonden!");
          element.value.targetValue = value;
        } else {
          updatedContent.value.content.push({
            type: "interactive_input",
            value: {
              id: key,
              targetValue: value,
              visible: false,
            },
          });
        }
        return updatedContent;
      });
    });
  }

  /*
  function addTargetValues(values, content) {
    const updatedContent = content;
    values.forEach((value, key) => {
      content.value.content.map(element => {
        if (key === element.value.id) {
          //console.log("element gevonden!");
          element.value.targetValue = value;
        } else {
          updatedContent.value.content.push({
            type: "interactive_input",
            value: {
              id: key,
              targetValue: value,
              visible: false,
            },
          });
        }
        return updatedContent;
      });
    });
  }
  */

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
            //console.log(index);
            const x = getTargetValues(content, index);
            //console.log(x);
            const newContent = addTargetValues(x, contentItem);
            //console.log(newContent);
            return (
              <SectionBlock
                key={`section ${contentItem.id}`}
                data={contentItem}
                //targetValue={targetValueMap}
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
