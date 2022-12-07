import RawHtml from "../../RawHtml/RawHtml";
import ButtonBlock from "@/components/Button/ButtonBlock";

type Props = {
  data: {
    type: string;
    value: {
      backgroundColor: string;
      title: string;
      size: React.ElementType;
      text: string;
      buttonBlock: React.ComponentProps<typeof ButtonBlock["buttons"]>;
    };
    id: string;
  };
};

export default function TitleBlock({ data }: Props) {
  const backgroundcolor = data.value.backgroundColor;
  const Tag = data.value.size;

  return (
    <div className={`${backgroundcolor}`}>
      <div className={`flex flex-row w-full h-fit defaultBlockPadding `}>
        <div className={`flex flex-col justify-start lg:mr-[40%]`}>
          <Tag>{data.value.title}</Tag>
          <div className="mt-6" data-testid="content">
            <RawHtml html={data.value?.text} />
          </div>
        </div>
      </div>
      {data.value.buttonBlock.length > 0 && (
        <ButtonBlock
          buttons={data.value.buttonBlock[0].value.buttons}
          align="btn-left"></ButtonBlock>
      )}
    </div>
  );
}
