import RawHtml from "../RawHtml";
import Button from "../Button/Button";
import MediaContent from "@/components/MediaContent/MediaContent";

type Props = {
  data: {
    type: string;
    value: {
      backgroundColor: string;
      title: string;
      size: React.ElementType;
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
  const backgroundcolor = data.value.backgroundColor;
  const buttons = data.value.button ? data.value.button : [];
  const Tag = data.value.size;

  function getGrid(gridData: string) {
    let left = "",
      right = "";

    if (gridData === "33_66") {
      (left = "lg:w-1/3"), (right = "lg:w-2/3");
    } else if (gridData == "50_50") {
      (left = "lg:w-1/2"), (right = "lg:w-1/2");
    } else if (gridData == "66_33") {
      (left = "lg:w-2/3"), (right = "lg:w-1/3");
    }

    return {
      left: left,
      right: right,
    };
  }

  const gridValue = getGrid(data.value.gridLayout);

  return (
    <div className={`${backgroundcolor} flex flex-col`}>
      <div className={`storyline__row flex flex-col lg:flex-row`}>
        <div
          className={`flex flex-col py-12 px-10 lg:px-16 lg:pt-16 ${gridValue.left} bg-slate-200`}>
          <Tag className={`mb-6`}>{data.value.title}</Tag>
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
