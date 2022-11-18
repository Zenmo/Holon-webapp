import Image from "next/future/image";
import React from "react";
import RawHtml from "../../RawHtml/RawHtml";

type CardItem = {
  title: string;
  imageSelector: {
    id: number;
    title: string;
    img: {
      src: string;
      width: number;
      height: number;
      alt: string;
    };
  };
  text: string;
  cardBackground: string;
  cardLink:
    | []
    | [
        {
          type: string;
          value: string;
          id: string;
        }
      ];
};

export type CardProps = {
  cardItem: CardItem;
};

export default function Card({ cardItem }: CardProps) {
  const colorStyle: string = cardItem.cardBackground;

  type ConditionalWrapperProps = {
    children: React.ReactElement;
    condition: boolean;
    wrapper: (children: React.ReactElement) => JSX.Element;
  };

  const ConditionalWrapper = ({ condition, wrapper, children }: ConditionalWrapperProps) =>
    condition ? wrapper(children) : children;

  let externLinkProps:
    | boolean
    | {
        target: string;
        rel: string;
      } = {
    target: "_blank",
    rel: "noopener noreferrer",
  };

  function createLink(linkData) {
    if (linkData.length && linkData[0].type === "intern") {
      externLinkProps = false;
    }
  }

  createLink(cardItem.cardLink);

  return (
    <ConditionalWrapper
      condition={cardItem.cardLink.length > 0}
      wrapper={children => (
        <a href={cardItem.cardLink[0]?.value} {...externLinkProps} className="group">
          {children}
        </a>
      )}>
      <React.Fragment>
        <span
          className={`min-h-[400px] ${colorStyle} border-solid border cardFadeIn rounded-lg flex h-full flex-col`}>
          <span className="overflow-hidden relative m-4 mb-0 flex-1 border">
            <Image
              src={cardItem.imageSelector.img.src}
              alt={cardItem.imageSelector.img.alt}
              width="725"
              height="380"
              className="object-cover object-center h-full w-full duration-300 max-w-none max-h-none brightness-90 ease-in group-hover:brightness-100 group-hover:scale-110"
            />
          </span>

          <span className="flex-col flex m-4 flex-1 max-h:1/2 overflow-hidden">
            <strong className="mb-3 block">{cardItem.title}</strong>
            <span className="">
              <RawHtml html={cardItem.text} />
            </span>
          </span>
        </span>
      </React.Fragment>
    </ConditionalWrapper>
  );
}
