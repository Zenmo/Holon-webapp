import React, { useEffect, useState } from "react";
import { StaticImage } from "@/components/ImageSelector/types";
import { Content } from "@/components/Blocks/SectionBlock/types";

export type HolarchyFeedbackImageProps = {
  id: string;
  type: string;
  value: {
    imageSelector: {
      id: string;
      title: string;
      img: StaticImage;
    };
    conditions: [
      {
        id: string;
        type: string;
        value: {
          parameter: string;
          operator: string;
          value: string;
        };
      }
    ];
  };
};

type Props = {
  content: Array<Content>;
  holarchyfeedbackimages: Array<HolarchyFeedbackImageProps>;
};

export default function HolarchyFeedbackImage({ content, holarchyfeedbackimages }: Props) {
  const [selectedImage, setSelectedImage] = useState({});

  useEffect(() => {
    setSelectedImage({});

    setSelectedImage(
      //loop through al configured images
      holarchyfeedbackimages.filter(feedbackimage => {
        if (feedbackimage.value.conditions.length > 0 && content.length) {
          //loop through all conditions within image...
          for (const conditionItem of feedbackimage.value.conditions) {
            //inputvalue is the vaule of the assessed validator
            const inputvalue = content?.find(
              content => content.value.id == parseFloat(conditionItem.value.parameter)
            ).currentValue;

            const conditionValue = parseFloat(conditionItem.value.value);

            if (inputvalue == null || inputvalue == undefined) {
              return false;
            } else if (conditionItem.value.operator == "bigger" && inputvalue <= conditionValue) {
              return false;
            } else if (
              conditionItem.value.operator == "biggerequal" &&
              inputvalue < conditionValue
            ) {
              return false;
            } else if (
              conditionItem.value.operator == "equal" &&
              inputvalue != conditionItem.value.value
            ) {
              return false;
            } else if (
              conditionItem.value.operator == "notequal" &&
              inputvalue == conditionItem.value.value
            ) {
              return false;
            } else if (conditionItem.value.operator == "lower" && inputvalue >= conditionValue) {
              return false;
            } else if (
              conditionItem.value.operator == "lowerequal" &&
              inputvalue > conditionValue
            ) {
              return false;
            } else {
            }
          }
          return true;
        }
      })[0]
    );
  }, [content, holarchyfeedbackimages]);

  return (
    <React.Fragment>
      {selectedImage && selectedImage.value ? (
        <img
          src={selectedImage?.value.imageSelector?.img?.src}
          alt={selectedImage?.value.imageSelector?.img?.alt}
          className="image z-10 absolute translate-x-[-50%] translate-y-[-50%] top-1/2 left-1/2	 max-h-[300%] max-w-full object-contain"
        />
      ) : (
        <img
          src={holarchyfeedbackimages[0]?.value.imageSelector?.img?.src}
          alt={holarchyfeedbackimages[0].value.imageSelector?.img?.alt}
          className="image z-10 absolute translate-x-[-50%] translate-y-[-50%] top-1/2 left-1/2	 max-h-[300%] max-w-full object-contain"
        />
      )}
    </React.Fragment>
  );
}
