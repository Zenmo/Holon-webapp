import React from "react";
import CardBlock from "@/components/Blocks/CardsBlock/CardBlock";
import TitleBlock from "@/components/Blocks/TitleBlock/TitleBlock";
import TextAndMedia from "@/components/TextAndMedia/TextAndMedia";
import styles from "./StaticPage.module.css";

export type StaticPage = {
  id: string;
  type: string;
  value: any;
};

const StaticPage = ({ content }: { content: StaticPage[] }) => {
  return (
    <div className={styles[""]}>
      {content?.map(contentItem => {
        switch (contentItem.type) {
          case "text_image_block":
            return <TextAndMedia key={`txtmedia ${contentItem.id}`} data={contentItem} />;
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
export default StaticPage;
