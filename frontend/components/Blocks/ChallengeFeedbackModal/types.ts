import { StaticImage } from "@/components/ImageSelector/types";

export type FeedbackModal = {
    id: string;
    type: string;
    value: {
      modaltitle: string;
      modaltext: string;
      modaltheme: string;
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
  }
