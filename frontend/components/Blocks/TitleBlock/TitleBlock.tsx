type Props = {
  data: {
    type: string;
    value: {
      block_background: {
        select_background: string;
      };
      title: string;
      size: string;
      text: string;
    };
    id: string;
  };
};

export default function TitleBlock(props: Props) {
  let backgroundcolor = props.data.value.block_background.select_background;
  let color = "";
  let Tag = props.data.value.size;

  return (
    <div className={`flex flex-row w-full py-12 px-[20%] ${backgroundcolor}`}>
      <div className={`flex flex-col ${color}`}>
        <Tag className={`text-2xl lg:text-3xl font-semibold`}>{props.data.value.title}</Tag>
        <div
          dangerouslySetInnerHTML={{ __html: props.data.value.text }}
          className="text-lg lg:text-xl"></div>
      </div>
    </div>
  );
}
