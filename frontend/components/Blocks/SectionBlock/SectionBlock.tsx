import { useState, useEffect, useMemo } from "react";
import ImageSlider from "@/components/InteractiveImage/ImageSlider";
import RawHtml from "@/components/RawHtml/RawHtml";
import InteractiveInputs from "@/components/InteractiveInputs/InteractiveInputs";
import { getGrid } from "services/grid";
import { getHolonKPIs, InteractiveElement } from "../../../api/holon";
import KPIDashboard from "@/components/KPIDashboard/KPIDashboard";
import { debounce } from "lodash";

type Props = {
  data: {
    type: string;
    value: {
      background: {
        color: string;
        size: string;
      };
      content: Content[];
      gridLayout: { grid: string };
    };
    id: string;
  };
};

export type Content =
  | {
      id: string;
      type: "text";
      value: string;
    }
  | {
      id: string;
      type: "slider";
      value: Slider;
    }
  | {
      id: string;
      type: "static_image";
      value: StaticImage;
    }
  | InteractiveContent;

export type InteractiveContent = {
  id: string;
  type: "interactive_input";
  currentValue?: number | string | string[] | number[] | undefined;
  value: InteractiveInput;
};

export type Slider = {
  id: number;
  name?: string;
  currentValue?: number;
  sliderValueDefault?: number;
  sliderValueMax?: number;
  sliderValueMin?: number;
  sliderLocked?: boolean;
};

export type StaticImage = {
  id?: number;
  title?: string;
  img: {
    alt: string;
    height: number;
    width: number;
    src: string;
  };
};

export type InteractiveInput = {
  id: number;
  name?: string;
  type?: string;
  defaultValueOverride?: string;
  animationTag?: string;
  options: InteractiveInputOptions[];
  display: string;
};
export type InteractiveInputOptions = {
  id: number;
  option?: string;
  default?: boolean;
  sliderValueDefault?: number;
  sliderValueMax?: number;
  sliderValueMin?: number;
};

const initialData = {
  local: {
    netload: 0,
    costs: 0,
    sustainability: 0,
    selfSufficiency: 0,
  },
  national: {
    netload: 0,
    costs: 0,
    sustainability: 0,
    selfSufficiency: 0,
  },
};
export default function SectionBlock({ data }: Props) {
  const [kpis, setKPIs] = useState(initialData);
  const [content, setContent] = useState<Content[]>([]);
  const [media, setMedia] = useState<StaticImage>({});
  const [loading, setLoading] = useState<boolean>(false);

  const backgroundFullcolor =
    data.value.background.size == "bg__full" ? data.value.background.color : "";

  // Have to create a seperate variable for this since the bg-color is semi-transparent
  // Otherwise they will overlap and will the left be darker since 2 layers
  const backgroundLeftColor =
    data.value.background.size == "bg__full" ? "" : data.value.background.color;
  const gridValue = getGrid(data.value.gridLayout.grid);

  const debouncedCalculateKPIs = useMemo(() => debounce(() => calculateKPIs(), 2000), []);

  useEffect(() => {
    const contentArr: Content[] = [];
    data?.value.content.map((content: Content) => {
      switch (content.type) {
        case "interactive_input":
          content.currentValue = getDefaultValue(content);
          contentArr.push(content);
          break;
        case "static_image":
          setMedia(content.value);
          break;
        default:
          contentArr.push(content);
          break;
      }
    });

    setContent([...contentArr]);
  }, [data]);

  useEffect(() => {
    // TODO remove console.log but retain content update
    console.log(content);
    debouncedCalculateKPIs();
  }, [content]);

  function getDefaultValue(content: InteractiveContent): string | number | string[] | undefined {
    switch (content.value.type) {
      case "single_select":
        return content.value.options.find(option => option.default)?.option;
      case "continuous":
        if (
          content.value.defaultValueOverride !== undefined &&
          content.value.defaultValueOverride !== ""
        ) {
          return content.value.defaultValueOverride;
        } else if (
          content.value.options.length &&
          content.value.options[0].sliderValueDefault !== undefined
        ) {
          return content.value.options[0].sliderValueDefault;
        } else {
          return 0;
        }
      case "multi_select":
        const defaultOptions = content.value.options.filter(option => option.default);
        defaultOptions.length && defaultOptions.map(option => option.option);
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
    setContent([...spreadedElements]);
    console.log("update");
    debouncedCalculateKPIs();
  }

  function calculateKPIs() {
    console.log("calculate");
    setLoading(true);
    const interactiveElements = content
      .filter(
        (element): element is InteractiveContent =>
          element.type == "interactive_input" &&
          (element.currentValue !== undefined || element.currentValue !== null)
      )
      .map((element): InteractiveElement => {
        return {
          interactiveElement: element.value.id,
          value: element.currentValue,
        };
      });
    if (!interactiveElements || interactiveElements.length === 0) return;
    getHolonKPIs({ interactiveElements: interactiveElements })
      .then(res => {
        setKPIs(res);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }

  return (
    <div className={`${backgroundFullcolor} storyline__row flex flex-col lg:flex-row`}>
      <div
        className={`flex flex-col defaultBlockPadding bg-slate-200 ${gridValue.left} ${backgroundLeftColor}`}>
        {content.map((ct, _index) => {
          if (ct.type === "slider") {
            return (
              <ImageSlider
                key={`slider${_index}`}
                inputId={ct.id}
                datatestid={`ct.value?.name${_index}`}
                value={ct.value.currentValue}
                setValue={setInteractiveInputValue}
                min={ct.value.sliderValueMin}
                max={ct.value.sliderValueMax}
                step={1}
                label={ct.value.name}
                type="range"
                locked={ct.value.sliderLocked}></ImageSlider>
            );
          } else if (ct.type === "interactive_input") {
            return (
              <InteractiveInputs
                setValue={setInteractiveInputValue}
                defaultValue={getDefaultValue(ct)}
                key={ct.id}
                contentId={ct.id}
                {...ct.value}
              />
            );
          } else if (ct.type == "text") {
            return <RawHtml key={`text_${_index}`} html={ct.value} />;
          } else {
            return null;
          }
        })}
      </div>
      <div className={`flex flex-col ${gridValue.right}`}>
        <div className="lg:sticky top-0">
          <div className="py-12 px-10 lg:px-16 lg:pt-24">
            {Object.keys(media).length > 0 && (
              /* eslint-disable @next/next/no-img-element */
              <img src={media.img?.src} alt={media.img?.alt} width="1600" height="900" />
            )}
          </div>
          <KPIDashboard data={kpis} loading={loading}></KPIDashboard>
        </div>
      </div>
    </div>
  );
}
