import React from "react";
import CardBlock from "@/components/Blocks/CardsBlock/CardBlock";
import TitleBlock from "@/components/Blocks/TitleBlock/TitleBlock";
import TextAndMediaBlock from "@/components/Blocks/TextAndMediaBlock/TextAndMediaBlock";
import HeaderFullImageBlock from "@/components/Blocks/HeaderFullImageBlock/HeaderFullImageBlock";
import styles from "./StaticPage.module.css";
import { basePageWrap } from "@/containers/BasePage";

import { PageProps, TextAndMediaVariant, TitleBlockVariant, CardBlockVariant } from "../types";

type Content = PageProps<TextAndMediaVariant | TitleBlockVariant | CardBlockVariant>;

const StaticPage = ({ content }: { content: Content[] }) => {
  return (
    <div className={styles[""]}>
      {content?.map(contentItem => {
        switch (contentItem.type) {
          case "header_full_image":
            return <HeaderFullImageBlock key={`headerfull ${contentItem.id}`} data={contentItem} />;
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
  );
};
export default basePageWrap(StaticPage);
