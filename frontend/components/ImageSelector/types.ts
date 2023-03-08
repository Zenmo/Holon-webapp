  export type StaticImage = {
    id?: number;
    title?: string;
    img: {
      alt: string;
      height: number;
      width: number;
      src: string;
    };
  };