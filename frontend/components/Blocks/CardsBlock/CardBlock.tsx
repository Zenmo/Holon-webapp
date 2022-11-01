import RawHtml from "../../RawHtml/RawHtml";

export default function CardsBlock({ data }) {
  const backgroundcolor = data.value.background;

  return (
    <div className={`flex flex-row w-full h-fit py-12 px-10 lg:px-16 lg:pt-16`}>
      <div className={`flex flex-col justify-start`}>
        <Tag className={``}>{data.value.title}</Tag>
        <div className="mt-6">
          <RawHtml html={data.value?.text} />
        </div>
      </div>
    </div>
  );
}
