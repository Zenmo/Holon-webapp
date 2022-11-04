import CardBlock from "@/components/Blocks/CardsBlock/CardBlock";
import HeroBlock from "@/components/Blocks/HeroBlock/HeroBlock";
import TitleBlock from "@/components/Blocks/TitleBlock/TitleBlock";
import TextAndMedia from "@/components/TextAndMedia/TextAndMedia";

import styles from "./HomePage.module.css";

const HomePageNew = ({ homepage }: { homepage: HomePage[] }) => {
  return (
    <div className={styles[""]}>
      {homepage?.map((content, _index) => {
        switch (content.type) {
          case "text_and_media":
            return <TextAndMedia key={`txtmedia ${_index}`} data={content} />;
            break;
          case "heroblock":
            return <HeroBlock key={`heroblock ${_index}`} data={content} />;
          case "title_block":
            return <TitleBlock key={`titleblock ${_index}`} data={content} />;
            break;
          case "card_block":
            return <CardBlock key={`cardsblock ${_index}`} data={content} />;
            break;
          default:
            null;
        }
      })}
    </div>
  );
};

export default HomePageNew;
