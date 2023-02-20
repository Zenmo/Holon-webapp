import RawHtml from "@/components/RawHtml";
import { getGrid } from "services/grid";

type Props = {
  ignoreLayout?: boolean;
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
    };
    id: string;
  };
};

export default function Paragraph({ data, ignoreLayout }: Props) {
  const backgroundFullcolor =
    data.value.background.size == "bg__full" ? data.value.background.color : "";

  // Have to create a seperate variable for this since the bg-color is semi-transparent
  // Otherwise they will overlap and will the left be darker since 2 layers
  const backgroundLeftColor =
    data.value.background.size == "bg__full" ? "" : data.value.background.color;

  const gridValue = getGrid(data.value.gridLayout.grid);

  if (ignoreLayout === true) {
    return <RawHtml html={data.value?.text} />;
  }

  return (
    <div className={`overflow-hidden ${backgroundFullcolor}`}>
      <div className="holonContentContainer">
        <div className="flex flex-col lg:flex-row">
          <div
            className={`flex flex-col relative defaultBlockPadding ${gridValue.left} ${backgroundLeftColor}`}
            data-testid="paragraph">
            {data.value.background.size !== "bg_full" && (
              <span className={`extra_bg ${backgroundLeftColor}`}></span>
            )}
            <RawHtml html={data.value?.text} />
          </div>
        </div>
      </div>
    </div>
  );
}
