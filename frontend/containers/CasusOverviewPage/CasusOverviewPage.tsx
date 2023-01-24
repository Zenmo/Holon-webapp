import React, { useState } from "react";

import Card from "@/components/Card/Card";
import { basePageWrap } from "@/containers/BasePage";
import HeroBlock from "@/components/Blocks/HeroBlock/HeroBlock";
import HeaderFullImageBlock from "@/components/Blocks/HeaderFullImageBlock/HeaderFullImageBlock";

const CasusOverviewPage = props => {
  const [casusses, setCasusses] = useState(props.childCasusses);

  const handleChange = e => {
    if (e.target.checked) {
      const filtered = casusses.filter(
        casus => casus.filter.toLowerCase() == e.target.name.toLowerCase()
      );
      setCasusses(filtered);
    } else {
      setCasusses(props.childCasusses);
    }
  };

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
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3">
            <ul>
              <li>
                <input type="checkbox" name="nationaal" onChange={handleChange} /> Nationaal
              </li>
              <li>
                <input type="checkbox" name="gemeente" onChange={handleChange} /> Gemeente
              </li>
            </ul>
          </div>
          <div className="col-span-9">
            <div className="flex flex-row flex-wrap justify-center md:justify-start mx-[-1rem] mt-3">
              {casusses.map((casus: any, index: number) => {
                return (
                  <div
                    key={index}
                    className="px-[1rem] flex-[0_0_50%] sm:flex-[0_0_33%] lg:flex-[0_0_25%] xl:flex-[0_0_20%]">
                    <Card cardItem={casus} cardType="storylineCard" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default basePageWrap(CasusOverviewPage);
