import React from "react";
import { useRouter } from "next/router";
import { ArrowSmallRightIcon } from "@heroicons/react/24/outline";
import RawHtml from "../RawHtml/RawHtml";
import StretchedLink from "../StretchedLink";

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
  text?: string;
  cardColor: string;
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
  cardType: string;
};

type CardTitleProps = {
  condition: boolean;
  children: React.ReactNode;
  linkProps: React.ComponentProps<"a">;
};

const CardTitle = ({ condition, children, ...linkProps }: CardTitleProps) => {
  if (condition) {
    return (
      <StretchedLink
        {...linkProps}
        content={children}
        className={`mb-3 block font-bold`}></StretchedLink>
    );
  }
  return <strong className="mb-3 block">{children}</strong>;
};

export default function Card({ cardItem, cardType }: CardProps) {
  const backgroundColor: string = cardItem.cardColor !== "" ? cardItem.cardColor : "bg-white";
  let cardStyling;

  let externLinkProps:
    | boolean
    | {
        target: string;
        rel: string;
      } = {
    target: "_blank",
    rel: "noopener noreferrer",
  };

  function cardStyle(type: string) {
    if (type === "buttonCard") {
      return (cardStyling = {
        card: "flex-row min-w-96 m-4 hover:brightness-110 h-16 md:h-24",
        imgSpan: "w-1/3",
        img: "rounded-l-lg",
        text: "flex-row justify-between items-center w-2/3 ml-12",
      });
    } else {
      return (cardStyling = {
        card: "flex-col min-h-96 w-1/2 md:w-1/3 lg:w-1/4 xl:w-[18.4%] mb-4",
        imgSpan: "h-2/3",
        img: "rounded-t-lg duration-300 ease-in group-hover:brightness-100 group-hover:scale-110",
        text: "flex-col h-1/3",
      });
    }
  }

  cardStyle(cardType);

  function createLink(cardLink) {
    if (cardLink.length && cardLink[0].type === "intern") {
      externLinkProps = false;
    }
  }

  createLink(cardItem.cardLink);

  return (
    <React.Fragment>
      <span
        className={`group ${cardStyling.card} ${backgroundColor} relative rounded-lg flex`}
        data-testid={cardItem.title}>
        <span className={`${cardStyling.imgSpan} overflow-hidden relative`}>
          {/* eslint-disable @next/next/no-img-element */}
          <img
            src={cardItem.imageSelector.img.src}
            alt={cardItem.imageSelector.img.alt}
            width="725"
            height="380"
            className={`object-cover object-center h-full w-full ${cardStyling.img} max-w-none  max-h-none brightness-90 `}
          />
        </span>

        <span className={`flex m-4 ${cardStyling.text}`}>
          <CardTitle
            condition={cardItem.cardLink.length > 0}
            href={cardItem.cardLink[0]?.value}
            {...externLinkProps}>
            {cardItem.title}
          </CardTitle>

          {cardType === "buttonCard" ? (
            <span className="w-10 h-10">
              <ArrowSmallRightIcon />
            </span>
          ) : (
            <span className="">
              <RawHtml html={cardItem.text} />
            </span>
          )}
        </span>
      </span>
    </React.Fragment>
  );
}
