import React from "react";
import { HolarchyFeedbackImageProps } from "../HolarchyFeedbackImage/HolarchyFeedbackImage";
import { Content } from "@/components/Blocks/SectionBlock/types";
import HolarchyFeedbackImage from "../HolarchyFeedbackImage/HolarchyFeedbackImage";

type HolarchyTab = {
  holarchyFeedbackImages: Array<HolarchyFeedbackImageProps>;
  content: Array<Content>;
  children: React.ReactNode;
};

export default function HolarchyTab({ holarchyFeedbackImages, content, children }: HolarchyTab) {
  return (
    <div className="w-screen h-screen bg-white">
      <div className="bg-white fixed top-[4.5rem] md:top-24 inset-x-0 mx-auto h-[calc(100%-4.5rem)] md:h-[calc(100%-9.5rem)] w-screen z-10 mt-14 grid grid-rows-9 grid-cols-1 md:grid-cols-3 md:grid-rows-3 ">
        {/* in here, the three cells of left column */}
        {children}

        {/*image */}
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

        {/*National KPIs */}
        <div className=" p-4 bg-holon-blue-100 row-start-7 row-span-1 col-start-1 col-span-1 md:col-start-3 md:col-span-1 md:row-start-1 md:row-span-1 border-b-2 border-dashed border-holon-blue-900">
          <p>
            Nationale KPI<span>&#39;</span>s
          </p>
        </div>

        {/*image */}
        <div className="relative bg-holon-blue-200 row-start-5 row-span-1 col-start-1 col-span-1 md:col-start-2 md:col-span-1 md:row-start-2 md:row-span-1">
          {holarchyFeedbackImages.length > 0 && (
            <HolarchyFeedbackImage
              holarchyfeedbackimages={holarchyFeedbackImages}
              content={content}
            />
          )}
        </div>

        {/*Middle KPIs */}
        <div className=" p-4 bg-holon-blue-200 row-start-8 row-span-1 col-start-1 col-span-1 md:col-start-3 md:col-span-1 md:row-start-2 md:row-span-1 border-b-2 border-dashed border-holon-blue-900">
          <p>
            Tussen KPI<span>&#39;</span>s
          </p>
        </div>

        {/*image */}
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

        {/*Local KPIs */}
        <div className=" p-4 bg-holon-blue-300  row-start-9 row-span-1 col-start-1 col-span-1 md:col-start-3 md:col-span-1 md:row-start-3 md:row-span-1 border-b-2 border-dashed border-holon-blue-900">
          <p>
            Lokale KPI<span>&#39;</span>s
          </p>
        </div>
      </div>
    </div>
  );
}
