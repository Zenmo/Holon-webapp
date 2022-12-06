import React from "react";
import RawHtml from "../RawHtml/RawHtml";
import StretchedLink from "../StretchedLink";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

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
  const backgroundColor: string = cardItem.cardBackground;
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
        card: "flex-row min-w-[400px] m-4 hover:brightness-110",
        img: "rounded-l-lg",
        text: "max-w-1/3 flex-row justify-between items-center",
      });
    } else {
      return (cardStyling = {
        card: "flex-col min-h-[400px]",
        img: "rounded-t-lg duration-300 ease-in group-hover:brightness-100 group-hover:scale-110",
        text: "max-h-1/3 flex-col ",
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
        className={`group ${cardStyling.card} ${backgroundColor} relative rounded-lg flex h-[100px]`}
        data-testid={cardItem.title}>
        <span className="overflow-hidden relative flex-1">
          {/* eslint-disable @next/next/no-img-element */}
          <img
            src={cardItem.imageSelector.img.src}
            alt={cardItem.imageSelector.img.alt}
            width="725"
            height="380"
            className={`object-cover object-center h-full w-full ${cardStyling.img} max-w-none max-h-none brightness-90 `}
          />
        </span>

        <span className={`flex m-4 flex-1 ${cardStyling.text} overflow-hidden`}>
          <CardTitle
            condition={cardItem.cardLink.length > 0}
            href={cardItem.cardLink[0]?.value}
            {...externLinkProps}>
            {cardItem.title}
          </CardTitle>

          {cardType === "buttonCard" ? (
            <span className="w-12 h-12">
              <ArrowRightIcon />
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
