import { FeedbackModal } from "../ChallengeFeedbackModal/types";
import { StaticImage } from "@/components/ImageSelector/types";
import { HolarchyFeedbackImage } from "@/components/Blocks/HolarchyFeedbackImage/HolarchyFeedbackImage";

export type Content =
  | {
      id: string;
      type: "text";
      value: string;
    }
  | {
      id: string;
      type: "static_image";
      value: StaticImage;
    }
  | {
      id: string;
      type: "holarchy_feedback_image";
      value: HolarchyFeedbackImage;
    }
  | InteractiveContent;

export type InteractiveContent = {
  id: string;
  type: "interactive_input";
  currentValue?: number | string | string[] | number[] | undefined;
  value: InteractiveInput;
};

export type InteractiveInput = {
  id: number;
  name?: string;
  type?: string;
  defaultValueOverride?: string;
  animationTag?: string;
  options: InteractiveInputOptions[];
  display: string;
  visible?: boolean;
};

export type InteractiveInputOptions = {
  id: number;
  option?: string;
  label?: string;
  default?: boolean;
  sliderValueDefault?: number;
  sliderValueMax?: number;
  sliderValueMin?: number;
};

export type Feedbackmodals = Array<FeedbackModal>;
