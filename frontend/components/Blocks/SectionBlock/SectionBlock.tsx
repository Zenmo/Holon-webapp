import ChallengeFeedbackModal from "@/components/Blocks/ChallengeFeedbackModal/ChallengeFeedbackModal";
import Button from "@/components/Button/Button";
import { StaticImage } from "@/components/ImageSelector/types";
import KPIDashboard from "@/components/KPIDashboard/KPIDashboard";
import { Graphcolor } from "@/containers/types";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { ScenarioContext } from "context/ScenarioContext";
import { debounce } from "lodash";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { getGrid } from "services/grid";
import { InteractiveElement, getHolonKPIs } from "../../../api/holon";
import { createTinyUrl } from "../../../api/tinyUrl";
import { HolarchyFeedbackImageProps } from "../HolarchyFeedbackImage/HolarchyFeedbackImage";
import { Background, GridLayout } from "../types";
import ContentColumn from "./ContentColumn";
import CostBenefitModal from "./CostBenefitModal/CostBenefitModal";
import HolarchyTab from "./HolarchyTab/HolarchyTab";
import { LegendItem } from "./HolarchyTab/LegendModal";
import ScenarioModal from "./ScenarioModals/ScenarioModal";
import { Content, Feedbackmodals, InteractiveContent, SavedElements } from "./types";

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
      openingSection?: boolean;
    };
    id: string;
  };
  pagetype?: string;
  feedbackmodals: Feedbackmodals[];
  graphcolors?: Graphcolor[];
  savePageValues: React.Dispatch<React.SetStateAction<SavedElements>>;
  saveScenario: (title: string, description: string, sectionId: string) => string;
  scenarioDiffElements: object;
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
export default function SectionBlock({
  data,
  pagetype,
  feedbackmodals,
  graphcolors,
  savePageValues,
  saveScenario,
  scenarioDiffElements,
}: Props) {
  const [kpis, setKPIs] = useState(initialData);
  const [costBenefitData, setCostBenefitData] = useState({});
  const [content, setContent] = useState<Content[]>([]);
  const [initialContent, setInitialContent] = useState<Content[]>([]);
  const [holarchyFeedbackImages, setHolarchyFeedbackImages] = useState<
    HolarchyFeedbackImageProps[]
  >([]);
  const [legendItems, setLegendItems] = useState([]);
  const [media, setMedia] = useState<StaticImage>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [costBenefitModal, setCostBenefitModal] = useState<boolean>(false);
  const [holarchyModal, setHolarchyModal] = useState<boolean>(false);
  const [legend, setLegend] = useState<boolean>(false);
  const [savedScenarioURL, setSavedScenarioURL] = useState<string>("");
  const [showScenarioModal, setShowScenarioModal] = useState<boolean>(false);
  const [scenarioModalType, setScenarioModalType] = useState<
    "saveScenario" | "savedScenario" | "openScenario"
  >("saveScenario");

  const scenario = useContext<number>(ScenarioContext);
  const [dirtyState, setDirtyState] = useState<boolean>(false);
  const [resetState, setResetState] = useState<boolean>(false);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

  const sectionContainerRef = useRef(null);

  const backgroundFullcolor =
    data.value?.background.size == "bg__full" ? data.value.background.color : "";

  // Have to create a seperate variable for this since the bg-color is semi-transparent
  // Otherwise they will overlap and will the left be darker since 2 layers
  const backgroundLeftColor =
    data.value.background.size == "bg__full" ? "" : data.value.background.color;
  const gridValue = getGrid(data.value.gridLayout.grid);

  const debouncedCalculateKPIs = useMemo(() => debounce(calculateKPIs, 1000), []);

  useEffect(() => {
    if (data.value.openingSection) {
      setScenarioModalType("openScenario");
      setShowScenarioModal(true);
    }
  }, []);

  useEffect(() => {
    setHolarchyFeedbackImages(content.filter(content => content.type == "holarchy_feedback_image"));
    setLegendItems(
      convertLegendItems(content.filter(content => content.type == "legend_items")[0])
    );
    savePageValues(saveCurrentValues(content));

    if (pagetype !== "Sandbox") {
      debouncedCalculateKPIs(content);
    } else {
      if (isInitialLoad) {
        setInitialContent(createCopyofContent([...content]));
        debouncedCalculateKPIs(content);
      }

      if (!isInitialLoad && !resetState) {
        // Added a timeout for better ux
        setTimeout(() => {
          setDirtyState(true);
        }, 500);
      }
    }
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

  function createCopyofContent(input: Content[]) {
    const returnArr: Content[] = [];
    input.map(inputObj => {
      returnArr.push({ ...inputObj });
    });

    return returnArr;
  }

  function resetContent() {
    // First set an empty array and after that fill the content with the initial content
    // TODO: Find a better way to reset the content. For now it works like this.
    setResetState(true);
    setContent([]);
    setTimeout(() => {
      setContent(createCopyofContent([...initialContent]));
      debouncedCalculateKPIs([...initialContent]);
    });
    setTimeout(() => {
      setResetState(false);
    }, 750);
    setDirtyState(false);
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
    setIsInitialLoad(false);
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
        setDirtyState(false);
      })
      .catch(() => {
        setLoading(false);
        setDirtyState(false);
      });
  }

  function convertLegendItems(items: Array<LegendItem>) {
    const return_arr = [];
    if (items) {
      items.value?.legendItems.map(item => {
        if (return_arr[item.value?.type] === undefined) {
          return_arr[item.value?.type] = [];
        }
        return_arr[item.value?.type].push(item.value);
      });
    }
    return return_arr;
  }

  const saveCurrentValues = (content: Content[]) => {
    //get currentValues of visible interactive elements
    const savedElements: SavedElements = {
      [data.id]: {},
    };

    content?.map((sectionItem: Content) => {
      if (sectionItem.type === "interactive_input" && sectionItem.value.visible) {
        const key = `${sectionItem.value.id}`;
        const value = sectionItem.currentValue;
        const name = sectionItem.value.name;

        savedElements[data.id] = {
          ...savedElements[data.id],
          [key]: {
            value: value,
            name: name,
          },
        };
      }
    });
    return savedElements;
  };

  async function handleSaveScenario(title: string, description: string) {
    const longUrl = saveScenario(title, description, data.id);
    const shortUrl = await createTinyUrl(longUrl);

    if (shortUrl) {
      setSavedScenarioURL(shortUrl);
    } else {
      setSavedScenarioURL(longUrl);
    }
    setScenarioModalType("savedScenario");
    return;
  }

  return (
    <div className={`sectionContainer`} ref={sectionContainerRef} id={data.id}>
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
      {showScenarioModal && (
        <ScenarioModal
          isOpen={showScenarioModal}
          onClose={() => setShowScenarioModal(false)}
          handleSaveScenario={handleSaveScenario}
          type={scenarioModalType}
          scenarioUrl={savedScenarioURL}
          scenarioTitle={data.value.scenarioTitle}
          scenarioDescription={data.value.scenarioDescription}
          scenarioDiffElements={scenarioDiffElements}
        />
      )}

      <div className="holonContentContainer">
        {pagetype !== "Sandbox" && (
          <div className="sticky z-20 top-[87px] flex flex-row items-center md:top-[90px] bg-white px-10 lg:px-16 pl-4 shadow-[0_3px_2px_-2px_rgba(0,0,0,0.3)]">
            <div className="flex-1">
              <button
                onClick={closeHolarchyModal}
                className={`px-6 pb-2 ${
                  holarchyModal
                    ? "bg-holon-gray-200 text-holon-blue-900"
                    : "bg-holon-blue-900 text-white"
                } border-x-2 border-t-2 border-solid h-12`}>
                Interactiemodus {pagetype}
              </button>
              <button
                onClick={openHolarchyModal}
                className={`px-6 pb-2 ${
                  holarchyModal
                    ? "bg-holon-blue-900 text-white"
                    : "bg-holon-gray-200 text-holon-blue-900"
                } border-x-2 border-t-2 border-solid h-12`}>
                Holarchie
              </button>
            </div>
            {holarchyModal &&
              ((legendItems["color"] && legendItems["color"].length > 0) ||
                (legendItems["line"] && legendItems["line"].length > 0)) && (
                <button
                  onClick={() => setLegend(!legend)}
                  className={`px-6 py-[0.65rem] bg-white flex ${
                    legend && "bg-holon-gray-200 border border-holon-slated-blue-900"
                  }`}>
                  <InformationCircleIcon className="mr-2 w-5 inline-block" />
                  Legenda
                </button>
              )}
            <div className="flex-1"></div>
          </div>
        )}

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
                pagetype={pagetype}
              />
            )}
          </div>

          <div className={`relative flex flex-col ${gridValue.right}`}>
            {dirtyState && (
              <div className="absolute flex justify-center items-center p-12 top-0 left-0 w-full h-full bg-black/[.8] z-20">
                <div className="bg-white p-12 w-50 inline-block mx-auto h-auto rounded">
                  <div>
                    <h2>Reken instellingen door</h2>
                    <p>
                      Heb je alle instellingen goed ingesteld, reken dan in een keer alles door. Na
                      het rekenen zijn de resultaten in het dashboard zichtbaar. Niet het gewenste
                      resultaat? Maak wijzigingen en reken nogmaals alle instellingen door.
                    </p>

                    <div className="flex justify-center mt-6 items-center">
                      <button className="font-bold mr-3 mb-4" onClick={() => resetContent()}>
                        Reset instellingen
                      </button>
                      <Button
                        onClick={() => {
                          debouncedCalculateKPIs(content);
                          setDirtyState(false);
                        }}>
                        Reken door
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                handleClickCostBen={openCostBenefitModal}
                handleClickScenario={() => {
                  setShowScenarioModal(true);
                  setScenarioModalType("saveScenario");
                }}></KPIDashboard>
            </div>
          </div>
        </div>

        <div>
          {holarchyModal && (
            <HolarchyTab
              holarchyFeedbackImages={holarchyFeedbackImages}
              legendItems={legendItems}
              content={content}
              dataContent={data?.value.content}
              handleContentChange={setContent}
              handleMedia={setMedia}
              textLabelNational={data.value.textLabelNational}
              textLabelIntermediate={data.value.textLabelIntermediate}
              textLabelLocal={data.value.textLabelLocal}
              loading={loading}
              kpis={kpis}
              legend={legend}></HolarchyTab>
          )}
        </div>
      </div>
    </div>
  );
}
