import RawHtml from "@/components/RawHtml";
import MediaContent from "@/components/MediaContent/MediaContent";
import { getGrid } from "services/grid";

type Props = {
  data: {
    type: string;
    value: {
      background: {
        color: string;
        size: string;
      };
      title: string;
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
      gridLayout: string;
      button?: Array<Button>;
    };
    id: string;
  };
};

type Button = {
  type: string;
  value: {
    button_style: string;
    button_text: string;
    button_hyperlink: string;
    button_align: string;
  };
  id: string;
};

export default function TextAndMedia({ data }: Props) {
  const buttons = data.value.button ? data.value.button : [];

  const backgroundFullcolor =
    data.value.background.size == "bg__full" ? data.value.background.color : "";

  // Have to create a seperate variable for this since the bg-color is semi-transparent
  // Otherwise they will overlap and will the left be darker since 2 layers
  const backgroundLeftColor =
    data.value.background.size == "bg__full" ? "" : data.value.background.color;

  const gridValue = getGrid(data.value.gridLayout.grid);

  return (
    <div>
      <div className={`${backgroundFullcolor} storyline__row flex flex-col lg:flex-row`}>
        <div
          className={`flex flex-col py-12 px-10 lg:px-16 lg:pt-16 ${gridValue.left} ${backgroundLeftColor}`}>
          <RawHtml html={data.value?.text} />
        </div>

        <div className={`flex flex-col ${gridValue.right}`}>
          <div className="lg:sticky py-12 px-10 lg:px-16 lg:pt-24 top:0">
            <MediaContent media={data.value.media} />
          </div>
        </div>
      </div>

      <div>
        {buttons.map((button, index) => {
          return (
            <Button
              href="www.nos.nl"
              key={index}
              text={button.value.button_text}
              align={button.value.button_align}></Button>
          );
        })}
      </div>
    </div>
  );
}
