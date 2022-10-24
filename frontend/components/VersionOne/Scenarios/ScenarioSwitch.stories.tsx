import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import ScenarioSwitch from "./ScenarioSwitch";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "UI/Scenarios/ScenarioSwitch",
  component: ScenarioSwitch,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof ScenarioSwitch>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ScenarioSwitch> = ({
  value: providedValue,
  updateValue,
  ...rest
}) => {
  const [value, setValue] = React.useState(false);

  if (!updateValue) {
    providedValue = value;
    updateValue = (id: string, value: boolean) => setValue(value);
  }

  return <ScenarioSwitch value={providedValue} updateValue={updateValue} {...rest} />;
};

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  neighbourhoodID: "my-neighbourhood",
  inputId: "my-switch",
  label: "My switch",
  scenarioId: "1",
  message: "A message",
  on: "On",
  off: "Off",
};

export const Locked = Template.bind({});
Locked.args = {
  neighbourhoodID: "my-neighbourhood",
  inputId: "my-switch",
  label: "My switch",
  scenarioId: "1",
  message: "A message",
  locked: true,
  on: "On",
  off: "Off",
};
