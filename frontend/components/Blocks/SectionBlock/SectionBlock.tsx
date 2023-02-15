import { useEffect, useMemo, useState, useRef } from "react";
import { debounce } from "lodash";
import InteractiveInputs from "@/components/InteractiveInputs/InteractiveInputs";
import KPIDashboard from "@/components/KPIDashboard/KPIDashboard";
import RawHtml from "@/components/RawHtml/RawHtml";
import HolarchyTab from "./HolarchyTab";
import ChallengeFeedbackModal from "@/components/Blocks/ChallengeFeedbackModal/ChallengeFeedbackModal";
import { getGrid } from "services/grid";
import { getHolonKPIs, InteractiveElement } from "../../../api/holon";

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
  pagetype?: string;
  feedbackmodals: Feedbackmodals[];
};

export type Content =
  | {
      id: string;
      type: "text";
      value: string;
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
  visible?: boolean;
};

export type InteractiveInputOptions = {
  id: number;
  option?: string;
  label?: string;
  default?: boolean;
  sliderValueDefault?: number;
  sliderValueMax?: number;
  sliderValueMin?: number;
};

export type Feedbackmodals = [
  {
    id: string;
    type: string;
    value: {
      modaltitle: string;
      modaltext: string;
      modaltheme: string;
      imageSelector: {
        id: number;
        title: string;
        img: {
          src: string;
          width: number;
          height: number;
          alt: string;
        };
      };
    };
    conditions: [
      {
        id: string;
        type: string;
        value: {
          parameter: string;
          oparator: string;
          value: string;
        };
      }
    ];
  }
];
const initialData = {
  local: {
    netload: null,
    costs: null,
    sustainability: null,
    selfSufficiency: null,
  },
  national: {
    netload: null,
    costs: null,
    sustainability: null,
    selfSufficiency: null,
  },
};
export default function SectionBlock({ data, pagetype, feedbackmodals }: Props) {
  const [kpis, setKPIs] = useState(initialData);
  const [content, setContent] = useState<Content[]>([]);
  const [media, setMedia] = useState<StaticImage>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [holarchyModal, setHolarchyModal] = useState<boolean>(false);

  const myRef = useRef(null);

  const backgroundFullcolor =
    data.value.background.size == "bg__full" ? data.value.background.color : "";

  // Have to create a seperate variable for this since the bg-color is semi-transparent
  // Otherwise they will overlap and will the left be darker since 2 layers
  const backgroundLeftColor =
    data.value.background.size == "bg__full" ? "" : data.value.background.color;
  const gridValue = getGrid(data.value.gridLayout.grid);

  const debouncedCalculateKPIs = useMemo(() => debounce(calculateKPIs, 1000), []);

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
    debouncedCalculateKPIs(content);
  }, [content, debouncedCalculateKPIs]);

  useEffect(() => {
    if (holarchyModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [holarchyModal]);

  function openHolarchyModal() {
    setHolarchyModal(true);
    myRef.current.classList.add("h-screen");
    myRef.current.scrollIntoView();
  }

  function closeHolarchyModal() {
    myRef.current.classList.remove("h-screen");
    setHolarchyModal(false);
  }

  function getDefaultValue(content: InteractiveContent): string | number | string[] | undefined {
    const defaultValue = content.value.defaultValueOverride;
    switch (content.value.type) {
      case "single_select":
        if (defaultValue) {
          return content.value.options.find(
            option => option.option === defaultValue || option.label === defaultValue
          )?.option;
        } else {
          return content.value.options.find(option => option.default)?.option;
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
        return defaultOptions.length ? defaultOptions.map(option => option.option) : undefined;
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
  }

  function calculateKPIs(content) {
    setLoading(true);
    const interactiveElements = content
      .filter(
        (element): element is InteractiveContent =>
          element.type == "interactive_input" &&
          element.currentValue !== undefined &&
          element.currentValue !== null
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
    <div className={`sectionContainer`} ref={myRef}>
      {feedbackmodals && (
        <ChallengeFeedbackModal feedbackmodals={feedbackmodals} kpis={kpis} content={content} />
      )}
      <div className="holonContentContainer">
        <div className="sticky top-[87px] md:top-[110px] bg-white z-10 mt-4 pt-2 pl-4">
          <div>
            <button
              onClick={closeHolarchyModal}
              className={`px-6 py-2 ${data.value.background.color} rounded-t-lg border-x-2 border-t-2 border-solid`}>
              Interactiemodus {pagetype}
            </button>
            <button
              onClick={openHolarchyModal}
              className={`px-6 py-2 bg-holon-blue-100 rounded-t-lg`}>
              Holarchie
            </button>
          </div>
        </div>

        <div className={`flex flex-col lg:flex-row ${backgroundFullcolor}`}>
          <div
            className={`flex flex-col py-12 px-10 lg:px-16 lg:pt-16 relative ${gridValue.left} ${backgroundLeftColor}`}>
            {data.value.background.size !== "bg_full" && !holarchyModal ? (
              <span className={`extra_bg ${backgroundLeftColor}`}></span>
            ) : (
              ""
            )}
            {content.map(ct => {
              if (ct.type === "interactive_input" && ct.value.visible) {
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
                return <RawHtml key={`text_${ct.id}`} html={ct.value} />;
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
              <KPIDashboard data={kpis} loading={loading} dashboardId={data.id}></KPIDashboard>
            </div>
          </div>
        </div>

        <div>{holarchyModal && <HolarchyTab />}</div>
      </div>
    </div>
  );
}
