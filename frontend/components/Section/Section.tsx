import { useState, useEffect } from "react";
import ImageSlider from "@/components/InteractiveImage/ImageSlider";
import Image from "next/image";
import RawHtml from "@/components/RawHtml/RawHtml";

export type Content = {
  id?: string;
  type?: string;
  value?: Slider | StaticImage | string;
};

export type Slider = {
  id?: number;
  name?: string;
  currentValue?: number;
  sliderValueDefault?: number;
  sliderValueMax?: number;
  sliderValueMin?: number;
};

export type StaticImage = {
  id?: number;
  title?: string;
  img?: {
    alt: string;
    height: number;
    width: number;
    src: string;
  };
};

export default function Section({ data }) {
  const [value, setValue] = useState<number>(0);
  const [content, setContent] = useState<Content[]>([]);
  const [media, setMedia] = useState<StaticImage>({});

  useEffect(() => {
    const contentArr: Content[] = [];
    data?.value.content.map((content: Content) => {
      switch (content.type) {
        case "slider":
        case "text":
          if (content.type == "slider") {
            content!.value.currentValue = content.value.sliderValueDefault;
          }
          contentArr.push(content);
          break;
        case "static_image":
          console.log(content);
          setMedia(content);
          break;
        default:
      }
    });

    setContent(contentArr);
  }, [data]);

  const setSliderValue = id => {
    const currentSlider = content.find(slider => slider.id == id);
    if (currentSlider !== undefined) {
      currentSlider.value.currentValue = value;
      const currentSliderIndex = content.findIndex(slider => slider.id == id);
      const spreadedSliders = [...content];
      spreadedSliders[currentSliderIndex] = currentSlider;
      setContent(spreadedSliders);
    }
  };

  function updateLayers(value: string, _setValue: (newValue: number) => void) {
    const newValue: number = parseInt(value);
    _setValue(newValue);
    setValue(newValue);
  }

  return (
    <div className="storyline__row flex flex-col lg:flex-row">
      <div className="flex flex-col p-8 lg:w-1/3 bg-slate-200">
        {content.map((ct, _index) => {
          if (ct.type == "slider") {
            return (
              <ImageSlider
                key={`slider${_index}`}
                inputId={`ct.value?.name${_index}`}
                datatestid={`ct.value?.name${_index}`}
                value={ct.value?.currentValue}
                setValue={() => setSliderValue(ct.id)}
                min={ct.value?.sliderValueMin}
                max={ct.value?.sliderValueMax}
                step={1}
                label={ct.value?.name}
                updateLayers={updateLayers}
                type="range"
                locked={ct.value?.sliderLocked}></ImageSlider>
            );
          }
          if (ct.type == "text") {
            return <RawHtml key={`text_${_index}`} html={ct.value} />;
          }
        })}
      </div>
      <div className="flex flex-col lg:w-2/3">
        {/* TODO: Set the imagesize dynamically */}
        <div className="storyline__row__image lg:sticky top-0 p-8">
          {Object.keys(media).length > 0 && (
            <Image
              src={process.env.NEXT_PUBLIC_BASE_URL + "/" + media.value.img.src}
              alt={media.value.img.alt}
              width={1600}
              height={900}
              objectFit="contain"
              className="image"
              priority={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}
