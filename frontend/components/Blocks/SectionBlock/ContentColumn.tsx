import { StaticImage } from "@/components/ImageSelector/types";
import InteractiveInputs from "@/components/InteractiveInputs/InteractiveInputs";
import RawHtml from "@/components/RawHtml/RawHtml";
import React, { useEffect } from "react";
import { Content, InteractiveContent } from "./types";

type ContentColumn = {
  dataContent: Content[];
  content: Content[];
  handleContentChange: React.Dispatch<React.SetStateAction<Content[]>>;
  handleMedia: React.Dispatch<React.SetStateAction<StaticImage>>;
  selectedLevel?: string;
};

export default function ContentColumn({
  dataContent,
  content,
  handleContentChange,
  handleMedia,
  selectedLevel,
}: ContentColumn) {
  useEffect(() => {
    const contentArr: Content[] = [];
    dataContent.map((content: Content) => {
      switch (content.type) {
        case "interactive_input":
          content.currentValue = content.currentValue
            ? content.currentValue
            : getDefaultValue(content);
          contentArr.push(content);
          break;
        case "static_image":
          handleMedia(content.value);
          break;
        default:
          contentArr.push(content);
          break;
      }
    });
    // Only trigger api-call when input has changed
    if (JSON.stringify(content) !== JSON.stringify(contentArr)) {
      handleContentChange([...contentArr]);
    }
  }, [dataContent]);

  function getDefaultValue(content: InteractiveContent): string | number | string[] | undefined {
    const defaultValue = content.value.defaultValueOverride;
    switch (content.value.type) {
      case "single_select":
        if (defaultValue) {
          return content.value.options.find(
            option => option.option === defaultValue || option.label === defaultValue
          )?.option;
        } else {
          const option = content.value.options.find(option => option.default);
          return option ? option.option : content.value.options[0].option;
        }
      case "continuous":
        if (defaultValue !== undefined && defaultValue !== "") {
          return Number(defaultValue);
        } else if (
          content.value.options.length &&
          content.value.options[0].sliderValueDefault !== undefined
        ) {
          return Number(content.value.options[0].sliderValueDefault);
        } else {
          return 0;
        }
      case "multi_select":
        const defaultValueArray = defaultValue && defaultValue.split(",");
        const defaultOptions = content.value.options.filter(
          option =>
            option.default ||
            defaultValueArray?.includes(option.option) ||
            defaultValueArray?.includes(option.label)
        );
        return defaultOptions.length ? defaultOptions.map(option => option.option) : [];
    }
  }

  function setInteractiveInputValue(
    id: string,
    value: number | string | boolean,
    optionId?: number
  ) {
    const currentElement: InteractiveContent | undefined = content
      .filter((element): element is InteractiveContent => element.type == "interactive_input")
      .find(element => element.id == id);

    const currentIndex: number = content.findIndex(
      (element): element is InteractiveContent => element.id == id
    );

    if (!currentElement) return;

    switch (currentElement.value.type) {
      case "single_select":
        const selectedOption = currentElement.value.options.find(option => option.id === optionId);
        if (!selectedOption) break;
        currentElement.currentValue = selectedOption.option;
        break;
      case "continuous":
        currentElement.currentValue = Number(value);
        break;

      case "multi_select":
        const currentOption = currentElement.value.options.find(option => option.id === optionId);
        if (!currentOption) break;
        const tempArray = new Set(currentElement.currentValue);
        if (value) {
          tempArray.add(currentOption.option);
        } else {
          tempArray.delete(currentOption.option);
        }
        currentElement.currentValue = [...tempArray];
        break;
    }

    const spreadedElements = [...content];
    spreadedElements[currentIndex] = currentElement;
    handleContentChange([...spreadedElements]);
  }

  return (
    <div
      data-empty="Er zijn er geen interactieve elementen in te stellen op dit niveau."
      className="before:empty:content-[attr(data-empty)]">
      {content.map((ct, index) => {
        if (ct.type === "interactive_input" && ct.value.visible) {
          return (
            <React.Fragment key={index}>
              <InteractiveInputs
                setValue={setInteractiveInputValue}
                defaultValue={getDefaultValue(ct)}
                currentValue={ct.currentValue}
                contentId={ct.id}
                selectedLevel={selectedLevel}
                {...ct.value}
              />
            </React.Fragment>
          );
        } else if (ct.type == "text" && !selectedLevel) {
          return <RawHtml key={`text_${ct.id}`} html={ct.value} />;
        } else {
          return null;
        }
      })}
    </div>
  );
}
