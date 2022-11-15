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

export default function TitleBlock({ data }: Props) {
  const backgroundcolor = data.value.backgroundColor;
  const Tag = data.value.size;

  return (
    <div>
      <div
        className={`flex flex-row w-full h-fit py-12 px-10 lg:px-16 lg:pt-16 ${backgroundcolor}`}>
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
