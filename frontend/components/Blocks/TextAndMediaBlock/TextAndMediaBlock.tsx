import RawHtml from "@/components/RawHtml";
import MediaContent from "@/components/MediaContent/MediaContent";
import ButtonBlock from "@/components/Button/ButtonBlock";
import { getGrid } from "services/grid";

type Props = {
  data: {
    type: string;
    value: {
      gridLayout: {
        grid: string;
      };
      background: {
        color: string;
        size: string;
      };
      text: string;
      media: [
        | {
            id: string;
            value: string;
            type: string;
            alt_text: string;
          }
        | {
            type: string;
            value: {
              id: number;
              title: string;
              img: {
                src: string;
                width: number;
                height: number;
                alt: string;
              };
            };
          }
      ];
      altText: string;
      buttonBlock: [] | Array<Buttons>;
    };
    id: string;
  };
};

type Buttons = {
  type: string;
  value: {
    buttonsAlign: string;
    buttons: Array<Button>;
  };
  id: string;
};

type Button = {
  type: string;
  value: {
    buttonStyle: "dark" | "light" | undefined;
    buttonText: string;
    buttonLink: [
      {
        type: "intern" | "extern";
        value: number | string;
        id: string;
      }
    ];
    buttonAlign: string;
  };
  id: string;
};

export default function TextAndMedia({ data }: Props) {
  const backgroundFullcolor =
    data.value.background.size == "bg__full" ? data.value.background.color : "";

  // Have to create a seperate variable for this since the bg-color is semi-transparent
  // Otherwise they will overlap and will the left be darker since 2 layers
  const backgroundLeftColor =
    data.value.background.size == "bg__full" ? "" : data.value.background.color;

  const gridValue = getGrid(data.value.gridLayout.grid);

  return (
    <div className={`${backgroundFullcolor}`}>
      <div className={` storyline__row flex flex-col lg:flex-row`}>
        <div
          className={`flex flex-col py-8 px-10 lg:px-16 lg:pt-16 ${gridValue.left} ${backgroundLeftColor}`}>
          <RawHtml html={data.value?.text} />
        </div>

        <div className={`flex flex-col ${gridValue.right}`}>
          <div className="lg:sticky py-8 px-10 lg:px-16 lg:pt-24 top-0">
            <MediaContent media={data.value.media} alt={data.value.altText} />
          </div>
        </div>
      </div>

      {data.value.buttonBlock.length > 0 && (
        <ButtonBlock
          buttons={data.value.buttonBlock[0].value.buttons}
          align={data.value.buttonBlock[0].value.buttonsAlign}></ButtonBlock>
      )}
    </div>
  );
}
