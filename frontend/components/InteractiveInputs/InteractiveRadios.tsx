import InteractiveDropdown from "./InteractiveDropdown";
import InteractiveInputPopover from "./InteractiveInputPopover";

function InteractiveRadios({
  contentId,
  name,
  type,
  display,
  moreInformation,
  titleWikiPage,
  linkWikiPage,
  options,
  selectedLevel,
  setValue,
  defaultValue,
}: Props) {
  const inputType = type === "single_select" ? "radio" : "checkbox";
  const cssClass =
    type === "single_select"
      ? "rounded-full after:checked:content-['●'] after:mt-[-2px]  flex-[0_0_20px]"
      : "rounded-none after:checked:content-['✔'] ";

  const defaultCheckedValue = type === "single_select" ? [defaultValue] : defaultValue;

  return (
    <div className="mb-4 font-bold text-base">
      <div className="flex flex-row mb-2 gap-3 items-center">
        <p>{name}</p>
        {/* if selectedLevel, then you are in the holarchy view and popover is not shown */}
        {!selectedLevel && (moreInformation || linkWikiPage) ? (
          <InteractiveInputPopover
            name={name}
            moreInformation={moreInformation}
            titleWikiPage={titleWikiPage}
            linkWikiPage={linkWikiPage}
            target="_blank" />
        ) : (
          ""
        )}
      </div>

      {display === "dropdown" ? (
        <div>
          <InteractiveDropdown
            defaultValue={defaultValue}
            options={options}
            onChange={setValue}
            contentId={contentId}
            selectedLevel={selectedLevel}
          />
        </div>
      ) : (
        options.map((inputItem, index) => (
          <div key={index} className="flex flex-row mb-2 gap-3 items-center">
            <label
              key={index}
              htmlFor={
                contentId + inputItem.id + (selectedLevel ? "holarchy" : "storyline") + "input"
              }
              className="flex flex-row mb-2 gap-4 items-center">
              <input
                defaultChecked={defaultCheckedValue.includes(inputItem.option)}
                type={inputType}
                name={name + contentId}
                id={contentId + inputItem.id + (selectedLevel ? "holarchy" : "storyline") + "input"}
                data-testid={name + inputItem.id}
                onChange={e => setValue(contentId, e.target.checked, inputItem.id)}
                className={`${cssClass} flex h-5 w-5 min-w-[1.25rem] appearance-none items-center justify-center border-2 border-holon-blue-900 from-inherit bg-center py-2 text-white checked:bg-holon-blue-500`}
              />
              <span className="">{inputItem.label || inputItem.option}</span>
            </label>
            {/* if selectedLevel, then you are in the holarchy view and popover is not shown */}
            {!selectedLevel && (inputItem.legalLimitation || inputItem.linkWikiPage) ? (
              <InteractiveInputPopover
                name={inputItem.label || inputItem.option}
                legal_limitation={inputItem.legalLimitation}
                color={inputItem.color}
                titleWikiPage={inputItem.titleWikiPage}
                linkWikiPage={inputItem.linkWikiPage}
                target="_blank" />
            ) : (
              ""
            )}

            {inputItem.color !== "no-color" && (
              <div
                className="rounded-full w-2 h-2 min-w-[0.5rem]"
                style={{ backgroundColor: inputItem.color }}></div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default InteractiveRadios;
