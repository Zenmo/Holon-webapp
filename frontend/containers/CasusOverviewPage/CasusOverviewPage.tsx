import React, { useState } from "react";

import Card from "@/components/Card/Card";
import { basePageWrap } from "@/containers/BasePage";
import ContentBlocks from "@/components/Blocks/ContentBlocks";

const CasusOverviewPage = ({
  hero,
  childCasusses,
  allCasusFilters,
}: {
  hero: any[];
  childCasusses: any[];
  allCasusFilters: any[];
}) => {
  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleChange = e => {
    const inputValue = e.target.value;

    if (selectedFilters.includes(inputValue)) {
      setSelectedFilters(selectedFilters.filter(label => label !== inputValue));
    } else {
      setSelectedFilters(selectedFilters => [...selectedFilters, inputValue]);
    }
  };

  return (
    <React.Fragment>
      <ContentBlocks content={hero} />

      <div className="holonContentContainer">
        <div className="defaultBlockPadding">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <ul>
                {allCasusFilters?.map((casusfilter, index) => (
                  <li key={index}>
                    <label className="flex flex-row mb-2 gap-4">
                      <input
                        type="checkbox"
                        className="rounded-none after:checked:content-['✔'] flex h-5 w-5 appearance-none items-center justify-center border-2 border-holon-blue-900 from-inherit bg-center py-2 text-white checked:bg-holon-blue-500 flex-[0_0_20px]"
                        name={casusfilter.name}
                        value={casusfilter.name}
                        onChange={handleChange}
                      />{" "}
                      <span className="mr-auto">{casusfilter.name}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-3">
              <div className="flex flex-row flex-wrap justify-center md:justify-start mx-[-1rem]">
                {childCasusses
                  ?.filter(casus =>
                    selectedFilters.length ? selectedFilters.includes(casus.filter) : casus
                  )
                  .map((casus: any, index: number) => {
                    return (
                      <div
                        key={index}
                        className="px-[1rem] flex-[0_0_50%] sm:flex-[0_0_33%] lg:flex-[0_0_33%] xl:flex-[0_0_25%]">
                        <Card cardItem={casus} cardType="storylineCard" />
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default basePageWrap(CasusOverviewPage);
