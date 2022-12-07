import { ArrowDownIcon } from "@heroicons/react/24/outline";
import MediaContent from "@/components/MediaContent/MediaContent";
import ButtonBlock from "@/components/Button/ButtonBlock";

import RawHtml from "../../RawHtml";

type Props = {
  data: {
    type: string;
    value: {
      backgroundColor: string;
      title: string;
      text: string;
      media: React.ComponentProps<typeof MediaContent>["media"];
      altText: string;
      buttonBlock: React.ComponentProps<typeof ButtonBlock["buttons"]>;
    };
    id: string;
  };
};

export default function HeroBlock({ data }: Props) {
  const backgroundcolor = data.value.backgroundColor;

  const scrollDown = () => {
    const viewportHeight = window.innerHeight;
    window.scrollTo({
      top: viewportHeight,
    });
  };

  return (
    <div>
      <div className={`flex flex-col justify-center w-full ${backgroundcolor}`}>
        <div className="holonContentContainer">
          <div className={`flex flex-col  lg:flex-row `}>
            <div className="flex flex-col lg:w-1/2 py-12 px-10 lg:px-16 gap-8">
              <h1>
                <RawHtml html={data.value.title}></RawHtml>
              </h1>
              <div className={`font-normal`} data-testid="content">
                <RawHtml html={data.value.text}></RawHtml>
              </div>
            </div>

            <div className="flex flex-col lg:w-1/2 py-12 px-10 lg:px-16">
              <MediaContent media={data.value.media} alt={data.value.altText} />
            </div>
          </div>

          {data.value.buttonBlock.length > 0 && (
            <div className="flex flex-row justify-center">
              <ButtonBlock
                buttons={data.value.buttonBlock[0].value.buttons}
                align={data.value.buttonBlock[0].buttons_align}></ButtonBlock>
            </div>
          )}
          <div className="flex flex-row h-16 justify-center">
            <button
              onClick={scrollDown}
              className="bg-holon-purple-100 w-12 h-12 mb-4 absolute rounded-full p-2 hover:bg-holon-purple-200">
              <ArrowDownIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
