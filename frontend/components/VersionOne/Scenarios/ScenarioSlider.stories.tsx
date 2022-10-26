import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import ScenarioSlider from "./ScenarioSlider";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "UI/Scenarios/ScenarioSlider",
  component: ScenarioSlider,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof ScenarioSlider>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ScenarioSlider> = ({
  value: providedValue,
  updateValue,
  ...rest
}) => {
  const [value, setValue] = React.useState(0);

  if (!updateValue) {
    providedValue = value;
    updateValue = (id: string, value: string) => setValue(parseFloat(value));
  }

  return <ScenarioSlider value={providedValue} updateValue={updateValue} {...rest} />;
};

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  neighbourhoodID: "my-neighbourhood",
  inputId: "my-input",
  label: "My input",
  scenarioId: "1",
  message: "A message",
};

export const Locked = Template.bind({});
Locked.args = {
  neighbourhoodID: "my-neighbourhood",
  inputId: "my-input",
  label: "My input",
  scenarioId: "1",
  message: "A message",
  locked: true,
};
