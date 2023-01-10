import React from "react";
import { useRouter } from "next/router";
import { ArrowSmallRightIcon } from "@heroicons/react/24/outline";
import RawHtml from "../RawHtml/RawHtml";
import StretchedLink from "../StretchedLink";
import StorylineIcons from "./StorylineIcons";
import { CardItem, CardProps, CardStyling, CardTitleProps } from "./types";

const CardTitle = ({ condition, children, ...linkProps }: CardTitleProps) => {
  if (condition) {
    return (
      <StretchedLink
        {...linkProps}
        content={children}
        className={`block font-bold line-clamp-2`}></StretchedLink>
    );
  }
  return <strong className="block line-clamp-2">{children}</strong>;
};

export default function Card({ cardItem, cardType }: CardProps) {
  const backgroundColor: string = cardItem.cardColor !== "" ? cardItem.cardColor : "bg-white";
  const router = useRouter();
  let link: string;
  let cardStyling: CardStyling = {
    card: "",
    imgSpan: "",
    img: "",
    text: "",
  };
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
        card: "flex-row min-w-96 hover:drop-shadow-md h-16 md:h-24",
        imgSpan: "w-1/3",
        img: "rounded-l-lg group-hover:brightness-110",
        text: "flex-row justify-between items-center w-2/3 ml-6 md:ml-12 text-xl md:text-2xl m-2 md:m-4",
      });
    } else {
      return (cardStyling = {
        card: "flex-col  min-h-96  mb-4 h-[360px] xl:h-[400px] overflow-hidden",
        imgSpan: "h-2/3",
        img: "rounded-t-lg duration-300 ease-in group-hover:brightness-100 group-hover:scale-110",
        text: "flex-col h-1/3 m-4",
      });
    }
  }

  cardStyle(cardType);

  function createLink(cardDetails: CardItem) {
    if (cardDetails.slug) {
      link = router.asPath + cardDetails.slug;
      externLinkProps = false;
    } else if (cardDetails.itemLink?.length) {
      link = cardDetails.itemLink[0]?.value;
      if (cardDetails.itemLink[0].type === "intern") {
        externLinkProps = false;
      }
    }
    return link;
  }

  return (
    <React.Fragment>
      <span
        className={`group ${cardStyling.card} ${backgroundColor} relative rounded-lg flex `}
        data-testid={cardItem.title}>
        <span className={`${cardStyling.imgSpan} overflow-hidden relative`}>
          {/* eslint-disable @next/next/no-img-element */}
          <img
            src={cardItem.thumbnail ? cardItem.thumbnail.url : cardItem.imageSelector?.img.src}
            alt={
              cardItem.thumbnail ? `storyline ${cardItem.title}` : cardItem.imageSelector?.img.alt
            }
            width="100%"
            height="auto"
            className={`object-cover object-center h-full w-full ${cardStyling.img}  max-w-none max-h-none brightness-90 overflow-hidden`}
          />
          {cardItem.informationTypes && (
            <span className="max-w-full  mt-auto text-right absolute bottom-1 flex justify-start self-end flex-wrap-reverse">
              {cardItem.informationTypes.map((informationtype, index) => (
                <span
                  key={index}
                  className="flex bg-white truncate opacity-80 rounded-3xl items-center py-1 px-2 ml-2 mt-2">
                  {informationtype.icon && <StorylineIcons icon={informationtype.icon} />}
                  {informationtype.name}
                </span>
              ))}
            </span>
          )}
        </span>

        <span className={`flex gap-2 overflow-hidden ${cardStyling.text}`}>
          <CardTitle
            condition={cardItem.slug || cardItem.itemLink?.length > 0}
            href={createLink(cardItem)}
            {...externLinkProps}>
            {cardItem.title}
          </CardTitle>

          {cardType === "buttonCard" ? (
            <span className="w-10 h-10 flex-[0_0_40px]" data-testid="arrow">
              <ArrowSmallRightIcon />
            </span>
          ) : (
            <span className="line-clamp-4">
              <RawHtml html={cardItem.description} />
            </span>
          )}
        </span>
      </span>
    </React.Fragment>
  );
}
