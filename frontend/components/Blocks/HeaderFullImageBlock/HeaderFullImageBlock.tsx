import { StaticImage } from "../../ImageSelector/types";

/* eslint-disable @next/next/no-img-element */
type Props = {
  data: {
    type: string;
    value: {
      title: string;
      size: React.ElementType;
      imageSelector: StaticImage;
      altText: string;
    };
    id: string;
  };
};

export default function HeaderFullImageBlock({ data }: Props) {
  const Tag = data.value.size;
  const ima = data.value.imageSelector?.img.src;

  return (
    <div
      style={{ backgroundImage: `url(${ima}` }}
      className={` h-[250px] md:h-[400px] xl:h-[500px] bg-no-repeat bg-cover bg-center rounded-b-3xl`}
      data-testid="header-full-image">
      { data.value.altText && (<span role="img" aria-label={data.value.altText}></span>)}
      {" "}
      <div className={`flex justify-center py-4 md:py-8 bg-holon-gray-300/70 rounded-b-3xl`}>
        <Tag>{data.value.title}</Tag>
      </div>
    </div>
  );
}
