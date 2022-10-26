import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import HolonButton from "./HolonButton";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "UI/HolonButton",
  component: HolonButton,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    variant: {
      control: "select",
      options: ["darkmode", "gold", "blue", "darkblue"],
    },
    onClick: { action: "clicked" },
  },
} as ComponentMeta<typeof HolonButton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof HolonButton> = args => <HolonButton {...args} />;

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  children: "Button",
};

export const Gold = Template.bind({});
Gold.args = {
  variant: "gold",
  children: "Button",
};

export const Blue = Template.bind({});
Blue.args = {
  variant: "blue",
  children: "Button",
};

export const DarkBlue = Template.bind({});
DarkBlue.args = {
  variant: "darkblue",
  children: "Button",
};
