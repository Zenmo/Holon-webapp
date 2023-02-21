import React, { useEffect, useMemo, useState, useRef } from "react";
import { debounce } from "lodash";
import { Content, InteractiveContent, Feedbackmodals } from "./types";
import { StaticImage } from "@/components/ImageSelector/types";
import { Background, GridLayout } from "../types";
import KPIDashboard from "@/components/KPIDashboard/KPIDashboard";
import ContentColumn from "./ContentColumn";
import HolarchyTab from "./HolarchyTab";
import ChallengeFeedbackModal from "@/components/Blocks/ChallengeFeedbackModal/ChallengeFeedbackModal";
import HolarchyFeedbackImage from "@/components/Blocks/HolarchyFeedbackImage/HolarchyFeedbackImage";
import { getGrid } from "services/grid";
import { getHolonKPIs, InteractiveElement } from "../../../api/holon";

type Props = {
  data: {
    type: string;
    value: {
      background: Background;
      content: Content[];
      gridLayout: GridLayout;
    };
    id: string;
  };
  pagetype?: string;
  feedbackmodals: Feedbackmodals[];
};

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
  const [holarchyFeedbackImages, setHolarchyFeedbackImages] = useState<Content[]>([]);
  const [media, setMedia] = useState<StaticImage>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [holarchyModal, setHolarchyModal] = useState<boolean>(false);

  const myRef = useRef(null);

  const levels = ["national", "intermediate", "local"];

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
              <KPIDashboard data={kpis} loading={loading} dashboardId={data.id}></KPIDashboard>
            </div>
          </div>
        </div>

        <div>
          {holarchyModal && (
            <HolarchyTab>
              <div className="relative bg-holon-blue-200 row-start-5 row-span-1 col-start-1 col-span-1 md:col-start-2 md:col-span-1 md:row-start-2 md:row-span-1">
                {holarchyFeedbackImages.length > 0 && (
                  <HolarchyFeedbackImage
                    holarchyfeedbackimages={holarchyFeedbackImages}
                    content={content}
                  />
                )}
              </div>
              {levels.map((level, index) => {
                const cssClasses = [
                  "row-start-1 bg-holon-blue-100 ",
                  "row-start-2 bg-holon-blue-200",
                  "row-start-3 bg-holon-blue-300",
                ];
                return (
                  <div
                    key={index}
                    className={`${cssClasses[index]} p-4  overflow-auto row-span-1 col-start-1 col-span-1 md:col-start-1 md:col-span-1  md:row-span-1 border-b-2 border-dashed border-holon-blue-900 `}>
                    <ContentColumn
                      dataContent={data?.value.content}
                      content={content}
                      handleContentChange={setContent}
                      handleMedia={setMedia}
                      selectedLevel={level}
                    />
                  </div>
                );
              })}
            </HolarchyTab>
          )}
        </div>
      </div>
    </div>
  );
}
