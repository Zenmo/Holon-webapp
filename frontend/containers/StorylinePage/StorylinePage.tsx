import { basePageWrap } from "@/containers/BasePage";
import styles from "./StorylinePage.module.css";
import React from "react";

import { PageProps, SectionVariant, TextAndMediaVariant } from "../types";
import ContentBlocks from "@/components/Blocks/ContentBlocks";

type Storyline = PageProps<SectionVariant | TextAndMediaVariant>;

const StorylinePage = ({ storyline }: { storyline: Storyline[] }) => {
  return (
    <div className={styles["StorylinePage"]}>
      <ContentBlocks content={storyline} pagetype={"Storyline"} />
    </div>
  );
};

export default basePageWrap(StorylinePage);
