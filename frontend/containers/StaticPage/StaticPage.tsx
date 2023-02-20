import React from "react";
import styles from "./StaticPage.module.css";
import { basePageWrap } from "@/containers/BasePage";

import { PageProps, TextAndMediaVariant, TitleBlockVariant, CardBlockVariant } from "../types";
import ContentBlocks from "@/components/Blocks/ContentBlocks";

type Content = PageProps<TextAndMediaVariant | TitleBlockVariant | CardBlockVariant>;

const StaticPage = ({ content }: { content: Content[] }) => {
  return (
    <div className={styles[""]}>
      <ContentBlocks content={content} />
    </div>
  );
};
export default basePageWrap(StaticPage);
