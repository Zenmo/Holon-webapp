export type CardItem = {
  title: string;
  imageSelector?: {
    id: number;
    title: string;
    img: {
      src: string;
      width: number;
      height: number;
      alt: string;
    };
  };
  description?: string;
  slug?: string;
  cardColor: string;
  itemLink?:
    | []
    | [
        {
          type: string;
          value: string;
          id: string;
        }
      ];
  role?: [
    {
      name: string;
    }
  ];
  informationTypes?: [
    {
      name: string;
      icon: string;
    }
  ];
  sector?: string;
  thumbnail?: {
    url: string;
    width: number;
    height: number;
  };
};

export type CardStyling = {
  card: string;
  imgSpan: string;
  img: string;
  text: string;
};

export type CardProps = {
  cardItem: CardItem;
  cardType: "buttonCard" | "storylineCard" | "cardBlockCard";
};

export type CardTitleProps = {
  condition: boolean;
  children: React.ReactNode;
  linkProps: React.ComponentProps<"a">;
};
