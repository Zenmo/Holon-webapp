import { useState, useEffect } from "react";
import ImageSlider from "../InteractiveImage/ImageSlider";
import Image from "next/image";

export default function Section({ data }) {
  const [value, setValue] = useState(0);
  const [sliders, setSliders] = useState([]);
  const [media, setMedia] = useState(null);
  const [imageSize, setImageSize] = useState({
    width: 1,
    height: 1,
  });

  useEffect(() => {
    const sliderArr = [];
    data?.value.content.map(content => {
      if (content.type == "slider") {
        content.value.currentValue = content.value.sliderValueDefault;
        sliderArr.push(content);
      }

      if (content.type == "static_image") {
        setMedia(content);
      }
    });

    setSliders(sliderArr);
  }, [data]);

  const setSliderValue = id => {
    const currentSlider = sliders.find(slider => slider.id == id);
    currentSlider.value.currentValue = value;
    const currentSliderIndex = sliders.findIndex(slider => slider.id == id);
    const spreadedSliders = [...sliders];
    spreadedSliders[currentSliderIndex] = currentSlider;
    setSliders(spreadedSliders);
  };

  function updateLayers(value: string, _setValue: (newValue: number) => void) {
    const newValue: number = parseInt(value);
    _setValue(newValue);
    setValue(newValue);
  }

  return (
    <div className="storyline__row flex flex-col lg:flex-row">
      <div className="flex flex-col p-8 lg:w-1/3 bg-slate-200">
        {sliders.map((slider, _index) => {
          return (
            <ImageSlider
              key={`slider${_index}`}
              inputId={`slider.value?.name${_index}`}
              datatestid={`slider.value?.name${_index}`}
              value={slider.value?.currentValue}
              setValue={() => setSliderValue(slider.id)}
              min={slider.value?.sliderValueMin}
              max={slider.value?.sliderValueMax}
              step={1}
              label={slider.value?.name}
              updateLayers={updateLayers}
              type="range"
              locked={slider.value?.sliderLocked}></ImageSlider>
          );
        })}
      </div>
      <div
        className="flex flex-col lg:w-2/3"
        // data-solarpanels={solarpanels}
        // data-windmills={windmills}
        // data-windforce={3}
      >
        {/* TODO: Set the imagesize dynamically */}
        <div className="storyline__row__image lg:sticky top-0 p-8">
          {media !== null && (
            <Image
              src={process.env.NEXT_PUBLIC_BASE_URL + "/" + media.value.img.src}
              alt={media.value.img.alt}
              width={1600}
              height={900}
              objectFit="contain"
              className="image"
              priority={true}
              onLoadingComplete={target => {
                setImageSize({
                  width: target.naturalWidth,
                  height: target.naturalHeight,
                });
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
