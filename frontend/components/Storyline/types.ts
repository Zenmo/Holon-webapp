export type Storyline = {
    title: string,
    description: string,
    body: Array<StorylineScenario>;
  };

  export type StorylineScenario = {
    value: {
      title: string,
      description: string,
      windmills_default: number;
      windmills_min: number;
      windmills_max: number;
      windmills_locked: boolean
      solarpanels_default: number;
      solarpanels_min: number;
      solarpanels_max: number;
      solarpanels_locked: boolean
    }
  };