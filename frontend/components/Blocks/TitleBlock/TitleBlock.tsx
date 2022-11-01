import RawHtml from "../../RawHtml/RawHtml";

export default function TitleBlock({ data }) {
  const backgroundcolor = data.value.background;
  const Tag = data.value.size;

  return (
    <div className={`flex flex-row w-full h-fit py-12 px-10 lg:px-16 lg:pt-16 ${backgroundcolor}`}>
      <div className={`flex flex-col justify-start lg:mr-[40%]`}>
        <Tag className={``}>{data.value.title}</Tag>
        <div className="mt-6">
          <RawHtml html={data.value?.text} />
        </div>
      </div>
    </div>
  );
}
