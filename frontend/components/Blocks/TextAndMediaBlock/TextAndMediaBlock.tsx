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
      columnOrder: string;
      background: {
        color: string;
        size: string;
      };
      text: string;
      media: React.ComponentProps<typeof MediaContent>["media"];
      altText: string;
      buttonBlock: React.ComponentProps<typeof ButtonBlock["buttons"]>;
    };
    id: string;
  };
};

export default function TextAndMedia({ data }: Props) {
  const backgroundFullcolor =
    data.value.background.size == "bg__full" ? data.value.background.color : "";

  // Have to create a seperate variable for this since the bg-color is semi-transparent
  // Otherwise they will overlap and will the left be darker since 2 layers
  const backgroundLeftColor =
    data.value.background.size == "bg__full" ? "" : data.value.background.color;

  const gridValue = getGrid(data.value.gridLayout.grid);
  const direction = data.value.columnOrder === "invert" ? "lg:flex-row-reverse" : "lg:flex-row";

  return (
    <div className={`${backgroundFullcolor}`}>
      <div className={` storyline__row flex flex-col ${direction}`}>
        <div
          className={`flex flex-col defaultBlockPadding ${gridValue.left} ${backgroundLeftColor}`}
          data-testid="textMedia">
          <RawHtml html={data.value?.text} />
        </div>

        <div className={`flex flex-col ${gridValue.right}`}>
          <div className="lg:sticky defaultBlockPadding top-0">
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
