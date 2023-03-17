import ChallengeFeedbackModal from "@/components/Blocks/ChallengeFeedbackModal/ChallengeFeedbackModal";
import { StaticImage } from "@/components/ImageSelector/types";
import KPIDashboard from "@/components/KPIDashboard/KPIDashboard";
import { Graphcolor } from "@/containers/types";
import { ScenarioContext } from "context/ScenarioContext";
import { debounce } from "lodash";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { getGrid } from "services/grid";
import { getHolonKPIs, InteractiveElement } from "../../../api/holon";
import { HolarchyFeedbackImageProps } from "../HolarchyFeedbackImage/HolarchyFeedbackImage";
import { Background, GridLayout } from "../types";
import ContentColumn from "./ContentColumn";
import CostBenefitModal from "./CostBenefitModal/CostBenefitModal";
import HolarchyTab from "./HolarchyTab";
import { Content, Feedbackmodals, InteractiveContent } from "./types";

type Props = {
  data: {
    type: string;
    value: {
      background: Background;
      content: Content[];
      textLabelNational: string;
      textLabelIntermediate: string;
      textLabelLocal: string;
      gridLayout: GridLayout;
    };
    id: string;
  };
  pagetype?: string;
  feedbackmodals: Feedbackmodals[];
  graphcolors?: Graphcolor[];
};

const initialData = {
  local: {
    netload: null,
    costs: null,
    sustainability: null,
    selfSufficiency: null,
  },
  intermediate: {
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
export default function SectionBlock({ data, pagetype, feedbackmodals, graphcolors }: Props) {
  const [kpis, setKPIs] = useState(initialData);
  const [costBenefitData, setCostBenefitData] = useState({});
  const [content, setContent] = useState<Content[]>([]);
  const [holarchyFeedbackImages, setHolarchyFeedbackImages] = useState<
    HolarchyFeedbackImageProps[]
  >([]);
  const [media, setMedia] = useState<StaticImage>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [costBenefitModal, setCostBenefitModal] = useState<boolean>(false);
  const [holarchyModal, setHolarchyModal] = useState<boolean>(false);
  const scenario = useContext<number>(ScenarioContext);

  const sectionContainerRef = useRef(null);

  const backgroundFullcolor =
    data.value.background.size == "bg__full" ? data.value.background.color : "";

  // Have to create a seperate variable for this since the bg-color is semi-transparent
  // Otherwise they will overlap and will the left be darker since 2 layers
  const backgroundLeftColor =
    data.value.background.size == "bg__full" ? "" : data.value.background.color;
  const gridValue = getGrid(data.value.gridLayout.grid);

  const debouncedCalculateKPIs = useMemo(() => debounce(calculateKPIs, 1000), []);

  useEffect(() => {
    setHolarchyFeedbackImages(content.filter(content => content.type == "holarchy_feedback_image"));
    debouncedCalculateKPIs(content);
  }, [content, debouncedCalculateKPIs]);

  useEffect(() => {
    if (costBenefitModal || holarchyModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [costBenefitModal, holarchyModal]);

  function openCostBenefitModal() {
    setCostBenefitModal(true);
  }

  function closeCostBenefitModal() {
    setCostBenefitModal(false);
  }

  function openHolarchyModal() {
    setHolarchyModal(true);
    sectionContainerRef.current.classList.add("h-screen");
    setTimeout(() => {
      sectionContainerRef.current.scrollIntoView();
    }, 0);
  }

  function closeHolarchyModal() {
    sectionContainerRef.current.classList.remove("h-screen");
    setHolarchyModal(false);
  }

  function calculateKPIs(content) {
    setLoading(true);
    const interactiveElements = content
      .filter(
        (element): element is InteractiveContent =>
          element.type == "interactive_input" &&
          element.currentValue !== undefined &&
          element.currentValue !== null &&
          element.currentValue.length !== 0
      )
      .map((element): InteractiveElement => {
        return {
          interactiveElement: element.value.id,
          value: Array.isArray(element.currentValue)
            ? element.currentValue.join(",")
            : element.currentValue,
        };
      });

    getHolonKPIs({ interactiveElements: interactiveElements, scenario: scenario })
      .then(res => {
        setCostBenefitData(res.costBenefitResults);
        setKPIs(res.dashboardResults);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }

  return (
    <div className={`sectionContainer`} ref={sectionContainerRef}>
      {feedbackmodals && (
        <ChallengeFeedbackModal feedbackmodals={feedbackmodals} kpis={kpis} content={content} />
      )}
      {costBenefitModal && costBenefitData && (
        <CostBenefitModal
          handleClose={closeCostBenefitModal}
          graphcolors={graphcolors ?? []}
          costBenefitData={costBenefitData}
        />
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
            {!holarchyModal && (
              <ContentColumn
                dataContent={data?.value.content}
                content={content}
                handleContentChange={setContent}
                handleMedia={setMedia}
              />
            )}
          </div>

          <div className={`flex flex-col ${gridValue.right}`}>
            <div className="lg:sticky top-0">
              <div className="py-12 px-10 lg:px-16 lg:pt-24">
                {Object.keys(media).length > 0 && (
                  /* eslint-disable @next/next/no-img-element */
                  <img src={media.img?.src} alt={media.img?.alt} width="1600" height="900" />
                )}
              </div>
              <KPIDashboard
                data={kpis}
                loading={loading}
                dashboardId={data.id}
                handleClickCostBen={openCostBenefitModal}></KPIDashboard>
            </div>
          </div>
        </div>

        <div>
          {holarchyModal && (
            <HolarchyTab
              holarchyFeedbackImages={holarchyFeedbackImages}
              content={content}
              dataContent={data?.value.content}
              handleContentChange={setContent}
              handleMedia={setMedia}
              textLabelNational={data.value.textLabelNational}
              textLabelIntermediate={data.value.textLabelIntermediate}
              textLabelLocal={data.value.textLabelLocal}
              loading={loading}
              kpis={kpis}></HolarchyTab>
          )}
        </div>
      </div>
    </div>
  );
}
