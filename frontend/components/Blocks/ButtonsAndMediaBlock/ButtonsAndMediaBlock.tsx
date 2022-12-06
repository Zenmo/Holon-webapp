import React from "react";
import MediaContent from "@/components/MediaContent/MediaContent";
import CardItem from "../../Card/Card";
import Card from "../../Card/Card";

type Props = {
  data: {
    type: string;
    value: {
      background: {
        color: string;
        size: string;
      };
      buttons: Array<typeof CardItem>;
      media: React.ComponentProps<typeof MediaContent>["media"];
      altText: string;
    };
    id: string;
  };
};

export default function ButtonsAndMedia({ data }: Props) {
  const backgroundFullcolor =
    data.value.background.size == "bg__full" ? data.value.background.color : "";

  // Have to create a seperate variable for this since the bg-color is semi-transparent
  // Otherwise they will overlap and will the left be darker since 2 layers
  const backgroundLeftColor =
    data.value.background.size == "bg__full" ? "" : data.value.background.color;

  return (
    <div className={`${backgroundFullcolor}`} data-testid="ButtonsMedia">
      <div className={`flex flex-col lg:flex-row`}>
        <div
          className={`flex flex-col py-8 px-10 lg:px-16 lg:pt-16 lg:w-1/2 ${backgroundLeftColor}`}>
          {data.value.buttons.map((buttonItem, index) => {
            return (
              <React.Fragment key={index}>
                <Card cardItem={buttonItem} cardType="buttonCard"></Card>
              </React.Fragment>
            );
          })}
        </div>

        <div className={`flex flex-col lg:w-1/2`}>
          <div className="lg:sticky py-8 px-10 lg:px-16 lg:pt-24 top-0">
            <MediaContent media={data.value.media} alt={data.value.altText} />
          </div>
        </div>
      </div>
    </div>
  );
}
