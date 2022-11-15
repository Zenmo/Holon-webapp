import CardBlock from "@/components/Blocks/CardsBlock/CardBlock";
import HeroBlock from "@/components/Blocks/HeroBlock/HeroBlock";
import TitleBlock from "@/components/Blocks/TitleBlock/TitleBlock";
import TextAndMediaBlock from "@/components/Blocks/TextAndMediaBlock/TextAndMediaBlock";
import { basePageWrap } from "../BasePage";

import styles from "./HomePage.module.css";

import {
  PageProps,
  TextAndMediaVariant,
  HeroBlockVariant,
  TitleBlockVariant,
  CardBlockVariant,
} from "../types";
import FloorPlan from "@/components/FloorPlan/FloorPlan";

const floorplanconfig = [
  "commercial",
  "commercial",
  "forest",
  "industry",
  "residential",
  "forest",
  "residential",
  "industry",
  "residential",
  "residential",
  "commercial",
  "forest",
  "residential",
  "industry",
  "residential",
  "commercial",
];

type HomePageProps = PageProps<
  TextAndMediaVariant | HeroBlockVariant | TitleBlockVariant | CardBlockVariant
>;

const HomePage = ({ content }: { content: HomePageProps[] }) => {
  return (
    <div className={styles[""]}>
      <FloorPlan config={floorplanconfig} />
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
