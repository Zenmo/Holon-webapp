import ContentBlocks from "@/components/Blocks/ContentBlocks";

import { basePageWrap } from "../BasePage";

import styles from "./HomePage.module.css";

import {
  PageProps,
  TextAndMediaVariant,
  HeroBlockVariant,
  TitleBlockVariant,
  CardBlockVariant,
} from "../types";

type HomePageProps = PageProps<
  TextAndMediaVariant | HeroBlockVariant | TitleBlockVariant | CardBlockVariant
>;

const HomePage = ({ content }: { content: HomePageProps[] }) => {
  return (
    <div className={styles[""]}>
      <ContentBlocks content={content} />
    </div>
  );
};

export default basePageWrap(HomePage);
