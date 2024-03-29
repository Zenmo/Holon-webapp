import { Content } from "@/components/Blocks/SectionBlock/types";
import { StaticImage } from "@/components/ImageSelector/types";
import HolarchyKPIDashboard from "@/components/KPIDashboard/HolarchyKPIDashboard";
import { KPIData } from "@/components/KPIDashboard/types";
import HolarchyFeedbackImage, {
  HolarchyFeedbackImageProps,
} from "../../HolarchyFeedbackImage/HolarchyFeedbackImage";
import ContentColumn from "../ContentColumn";
import LegendModal, { LegendItem } from "./LegendModal";

type HolarchyTab = {
  holarchyFeedbackImages: Array<HolarchyFeedbackImageProps>;
  legendItems: Array<LegendItem>;
  content: Array<Content>;
  dataContent: Content[];
  handleContentChange: React.Dispatch<React.SetStateAction<Content[]>>;
  handleMedia: React.Dispatch<React.SetStateAction<StaticImage>>;
  textLabelNational: string;
  textLabelIntermediate: string;
  textLabelLocal: string;
  loading: boolean;
  kpis: KPIData;
  legend: boolean;
};

export default function HolarchyTab({
  holarchyFeedbackImages,
  legendItems,
  content,
  dataContent,
  handleContentChange,
  handleMedia,
  textLabelNational,
  textLabelIntermediate,
  textLabelLocal,
  loading,
  kpis,
  legend,
}: HolarchyTab) {
  const levels = ["national", "intermediate", "local"];

  return (
    <div className="w-screen h-screen bg-white">
      <div className="bg-white fixed top-[7.9rem] min-[700px]:top-[5.1rem] overflow-auto md:overflow-hidden inset-x-0 mx-auto h-[calc(100%-11rem)] min-[700px]:h-[calc(100%-8rem)] w-screen z-15 mt-14 grid grid-rows-9 grid-cols-1 md:grid-cols-3 md:grid-rows-3 ">
        {/*Interactive input -  left column */}
        {levels.map((level, index) => {
          const cssClasses = [
            "row-start-1 bg-holon-holarchy-national",
            "row-start-2 bg-holon-holarchy-intermediate",
            "row-start-3 bg-holon-holarchy-local",
          ];
          return (
            <div
              key={index}
              className={`${cssClasses[index]} p-4  overflow-auto row-span-1 col-start-1 col-span-1 md:col-start-1 md:col-span-1  md:row-span-1  `}>
              <p className="font-semibold	">
                {level == "national"
                  ? textLabelNational
                  : level == "local"
                  ? textLabelLocal
                  : level == "intermediate"
                  ? textLabelIntermediate
                  : ""}
              </p>
              <ContentColumn
                dataContent={dataContent}
                content={content}
                handleContentChange={handleContentChange}
                handleMedia={handleMedia}
                selectedLevel={level}
              />
            </div>
          );
        })}

        <div className="row-span-1 row-start-4 col-start-1 col-span-1 md:col-start-2  md:col-span-1  md:row-span-3 md:row-start-1 grid grid-rows grid-rows-3 overflow-hidden">
          {/*image - highest block*/}
          <div className="row-start-1 bg-holon-holarchy-national row-span-1 col-start-1 col-span-1 ">
            {legend && <LegendModal data={legendItems} />}
          </div>

          {/*image - middle block showing image*/}
          <div className="relative bg-holon-holarchy-intermediate row-start-2 row-span-1 col-start-1 col-span-1 ">
            {holarchyFeedbackImages.length > 0 && (
              <HolarchyFeedbackImage
                holarchyfeedbackimages={holarchyFeedbackImages}
                content={content}
              />
            )}
          </div>

          {/*image - lowest block*/}
          <div className="bg-holon-holarchy-local  row-start-3 row-span-1 col-start-1 col-span-1"></div>
        </div>
        {/* KPIs - right column */}
        {/*National KPIs */}

        <HolarchyKPIDashboard
          textLabelNational={textLabelNational}
          textLabelIntermediate={textLabelIntermediate}
          textLabelLocal={textLabelLocal}
          loading={loading}
          data={kpis}></HolarchyKPIDashboard>
      </div>
    </div>
  );
}
