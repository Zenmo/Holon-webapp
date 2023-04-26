import { HolarchyFeedbackImageProps } from "@/components/Blocks/HolarchyFeedbackImage/HolarchyFeedbackImage";
import { StaticImage } from "@/components/ImageSelector/types";
import { FeedbackModal } from "../ChallengeFeedbackModal/types";

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
      value: HolarchyFeedbackImageProps;
    }
  | InteractiveContent;

export type InteractiveContent = {
  id: string;
  type: "interactive_input";
  currentValue?: number | string | string[] | number[] | undefined | null;
  value: InteractiveInput;
};

export type InteractiveInput = {
  id: number;
  name?: string;
  type?: string;
  defaultValueOverride?: string;
  targetValue?: string | number | [];
  targetValuePreviousSection: string | number | [];
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
