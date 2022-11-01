import SolarpanelsAndWindmills from "@/components/Scenarios/SolarpanelsAndWindmills";
import TextAndMedia from "@/components/TextAndMedia/TextAndMedia";

import styles from "./StorylinePage.module.css";

export type Storyline = {
  id: string;
  type: string;
  value: any;
};

export type Scenario = {
  id: string;
  type: string;
  value: { content: Slider[] };
};

export type Slider = {
  id: string;
  type: string;
  value: StorylineScenario;
};

export type StorylineScenario = {
  id: number;
  name: string;
  description?: string;
  tag: string;
  sliderValueDefault: number;
  sliderValueMin: number;
  sliderValueMax: number;
  sliderLocked: boolean;
};

const StorylinePage = ({ storyline }: { storyline: Storyline[] }) => {
  return (
    <div className={styles["StorylinePage"]}>
      {storyline?.map((content, _index) => {
        switch (content.type) {
          case "text_and_media":
            return <TextAndMedia key={`txtmedia ${_index}`} data={content} />;
            break;
          case "section":
            return <SolarpanelsAndWindmills key={`solarwind ${_index}`} data={content} />;
            break;
          default:
            null;
        }
      })}
    </div>
  );
};

export default StorylinePage;
