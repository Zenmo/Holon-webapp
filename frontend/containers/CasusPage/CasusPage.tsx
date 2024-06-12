import React from "react";
import Card from "@/components/Card/Card";
import styles from "./CasusPage.module.css";
import { basePageWrap } from "@/containers/BasePage";

import { PageProps, TextAndMediaVariant, TitleBlockVariant, CardBlockVariant } from "../types";
import ContentBlocks from "@/components/Blocks/ContentBlocks";

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
  return (
    <div className={styles[""]}>
      <ContentBlocks content={content} />

      {linkedBestPractices && linkedBestPractices.length > 0 && (
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
