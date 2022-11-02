import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import InteractiveImage from "./InteractiveImage";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "UI/InteractiveImage",
  component: InteractiveImage,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof InteractiveImage>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof InteractiveImage> = () => <InteractiveImage />;

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {};
