import CardBlock from "@/components/Blocks/CardsBlock/CardBlock";
import HeroBlock from "@/components/Blocks/HeroBlock/HeroBlock";
import TitleBlock from "@/components/Blocks/TitleBlock/TitleBlock";
import TextAndMediaBlock from "@/components/Blocks/TextAndMediaBlock/TextAndMediaBlock";
import { basePageWrap } from "../BasePage";

import styles from "./HomePage.module.css";

type TextAndMediaVariant = {
  type: "text_image_block";
} & React.ComponentProps<typeof TextAndMedia>["data"];

type HeroBlockVariant = {
  type: "hero_block";
} & React.ComponentProps<typeof HeroBlock>["data"];

type TitleBlockVariant = {
  type: "title_block";
} & React.ComponentProps<typeof TitleBlock>["data"];

type CardBlockVariant = {
  type: "card_block";
} & React.ComponentProps<typeof CardBlock>["data"];

export type HomePageProps = {
  id: string;
} & (TextAndMediaVariant | HeroBlockVariant | TitleBlockVariant | CardBlockVariant);

const HomePage = ({ content }: { content: HomePageProps[] }) => {
  return (
    <div className={styles[""]}>
      {content?.map(contentItem => {
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
  );
};

export default basePageWrap(HomePage);
