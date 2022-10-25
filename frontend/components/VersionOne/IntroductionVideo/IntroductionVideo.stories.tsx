import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import IntroductionVideo from "./IntroductionVideo";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "UI/IntroductionVideo",
  component: IntroductionVideo,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof IntroductionVideo>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof IntroductionVideo> = args => <IntroductionVideo />;

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {};
