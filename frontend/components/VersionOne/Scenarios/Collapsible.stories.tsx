import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Collapsible from "./Collapsible";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "UI/Scenarios/Collapsible",
  component: Collapsible,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof Collapsible>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Collapsible> = args => <Collapsible {...args} />;

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  label: "Collapsible label",
  children: "This is the content of the collapsible",
};
