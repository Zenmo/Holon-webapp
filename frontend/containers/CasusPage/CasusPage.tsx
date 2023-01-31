import React from "react";
import CardBlock from "@/components/Blocks/CardsBlock/CardBlock";
import TitleBlock from "@/components/Blocks/TitleBlock/TitleBlock";
import TextAndMediaBlock from "@/components/Blocks/TextAndMediaBlock/TextAndMediaBlock";
import ParagraphBlock from "@/components/Blocks/ParagraphBlock/ParagraphBlock";
import HeaderFullImageBlock from "@/components/Blocks/HeaderFullImageBlock/HeaderFullImageBlock";
import TableBlock from "@/components/Blocks/TableBlock/TableBlock";
import Card from "@/components/Card/Card";
import styles from "./CasusPage.module.css";
import { basePageWrap } from "@/containers/BasePage";

import { PageProps, TextAndMediaVariant, TitleBlockVariant, CardBlockVariant } from "../types";

type Content = PageProps<TextAndMediaVariant | TitleBlockVariant | CardBlockVariant>;

const CasusPage = ({
  content,
  childPages,
  linkedBestPractices,
}: {
  content: Content[];
  childPages: any[];
  linkedBestPractices: any[];
}) => {
  console.log;
  return (
    <div className={styles[""]}>
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
      {childPages && (
        <div className="holonContentContainer">
          <div className="defaultBlockPadding ">
            <div className="flex flex-row gap-4 ">
              {childPages?.map((child, index) => {
                return (
                  <a
                    key={index}
                    className="border-holon-blue-900 text-white bg-holon-blue-900 hover:bg-holon-blue-500 flex flex-row justify-center items-center relative rounded border-2 nowrap px-4 py-3 mb-4 min-w-[8rem] text-center font-medium leading-5 transition enabled:active:translate-x-holon-bh-x enabled:active:translate-y-holon-bh-y disabled:opacity-50"
                    href={child.slug}>
                    {child.title}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {linkedBestPractices.length > 0 && (
        <div className="holonContentContainer">
          <div className="defaultBlockPadding ">
            <h2 className="mb-5">Ontdek in de praktijk</h2>
            <div className="flex flex-row gap-4">
              {linkedBestPractices?.map((child, index) => {
                return (
                  <div
                    key={index}
                    className="px-[1rem] flex-[0_0_50%] sm:flex-[0_0_33%] lg:flex-[0_0_25%] xl:flex-[0_0_20%]">
                    <Card cardItem={child} cardType="storylineCard" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default basePageWrap(CasusPage);
