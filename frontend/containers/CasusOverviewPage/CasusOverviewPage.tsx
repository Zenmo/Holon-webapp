import React from "react";

import Card from "@/components/Card/Card";
import { basePageWrap } from "@/containers/BasePage";
import HeroBlock from "@/components/Blocks/HeroBlock/HeroBlock";
import HeaderFullImageBlock from "@/components/Blocks/HeaderFullImageBlock/HeaderFullImageBlock";

const CasusOverviewPage = props => {
  console.log(props);
  return (
    <React.Fragment>
      {props.hero?.map(contentItem => {
        switch (contentItem.type) {
          case "header_full_image_block":
            return <HeaderFullImageBlock key={`headerfull ${contentItem.id}`} data={contentItem} />;
          case "hero_block":
            return <HeroBlock key={`heroblock ${contentItem.id}`} data={contentItem} />;
          default:
            null;
        }
      })}
      <div className="holonContentContainer">
        <div className="flex flex-row flex-wrap justify-center md:justify-start mx-[-1rem] mt-3">
          {props.childCasusses.map((casus: any, index: number) => {
            if (Object.keys(casus.connectedCasusContent).length) {
              return (
                <div
                  key={index}
                  className="px-[1rem] flex-[0_0_50%] sm:flex-[0_0_33%] lg:flex-[0_0_25%] xl:flex-[0_0_20%]">
                  <Card cardItem={casus.connectedCasusContent} cardType="storylineCard" />
                </div>
              );
            }
          })}
        </div>
      </div>
    </React.Fragment>
  );
};

export default basePageWrap(CasusOverviewPage);
