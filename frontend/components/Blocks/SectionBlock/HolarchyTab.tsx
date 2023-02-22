import HolarchyFeedbackImage from "../HolarchyFeedbackImage/HolarchyFeedbackImage";
import ContentColumn from "./ContentColumn";
import { HolarchyFeedbackImageProps } from "../HolarchyFeedbackImage/HolarchyFeedbackImage";
import HolarchyKPIDashboard from "@/components/KPIDashboard/HolarchyKPIDashboard";
import { Content } from "@/components/Blocks/SectionBlock/types";
import { StaticImage } from "@/components/ImageSelector/types";
import { KPIData } from "@/components/KPIDashboard/types";

type HolarchyTab = {
  holarchyFeedbackImages: Array<HolarchyFeedbackImageProps>;
  content: Array<Content>;
  dataContent: Content[];
  handleContentChange: React.Dispatch<React.SetStateAction<Content[]>>;
  handleMedia: React.Dispatch<React.SetStateAction<StaticImage>>;
  textLabelNational: string;
  textLabelIntermediate: string;
  textLabelLocal: string;
  loading: boolean;
  kpis: KPIData;
};

export default function HolarchyTab({
  holarchyFeedbackImages,
  content,
  dataContent,
  handleContentChange,
  handleMedia,
  textLabelNational,
  textLabelIntermediate,
  textLabelLocal,
  loading,
  kpis,
}: HolarchyTab) {
  const levels = ["national", "intermediate", "local"];

  return (
    <div className="w-screen h-screen bg-white">
      <div className="bg-white fixed top-[4.5rem] md:top-24 overflow-auto md:overflow-hidden inset-x-0 mx-auto h-[calc(100%-4.5rem)] md:h-[calc(100%-9.5rem)] w-screen z-10 mt-14 grid grid-rows-9 grid-cols-1 md:grid-cols-3 md:grid-rows-3 ">
        {/*Interactive input -  left column */}
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
                dataContent={dataContent}
                content={content}
                handleContentChange={handleContentChange}
                handleMedia={handleMedia}
                selectedLevel={level}
              />
            </div>
          );
        })}

        {/*image - highest block*/}
        <div className="relative row-start-4 bg-holon-blue-100 row-span-1 col-start-1 col-span-1 md:col-start-2 md:col-span-1 md:row-start-1 md:row-span-1">
          <svg
            viewBox="0 0 2 1"
            preserveAspectRatio="none"
            className="md:w-full md:h-[50px] md:absolute md:top-[100%] md:fill-[#e8eeff] z-10"
            height="1"
            width="2">
            <path
              vectorEffect="non-scaling-stroke"
              d="
            M1 1
            L0 0
            L2 0 Z"
            />
          </svg>
        </div>

        {/*image - middle block showing image*/}
        <div className="relative bg-holon-blue-200 row-start-5 row-span-1 col-start-1 col-span-1 md:col-start-2 md:col-span-1 md:row-start-2 md:row-span-1">
          {holarchyFeedbackImages.length > 0 && (
            <HolarchyFeedbackImage
              holarchyfeedbackimages={holarchyFeedbackImages}
              content={content}
            />
          )}
        </div>

        {/*image - lowest block*/}
        <div className="relative overflow-hidden bg-holon-blue-300  row-start-6 row-span-1 col-start-1 col-span-1 md:col-start-2 md:col-span-1 md:row-start-3 md:row-span-1">
          <svg
            viewBox="0 0 2 1"
            preserveAspectRatio="none"
            className="md:w-full md:h-[50px] md:absolute md:top-[-2px] md:fill-[#d8e3ff]"
            height="1"
            width="2">
            <path
              vectorEffect="non-scaling-stroke"
              d="
            M1 1
            L0 0
            L2 0 Z"
            />
          </svg>
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
