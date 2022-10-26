import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import ContentBlock from "./ContentBlock";

function GreekingText() {
  return (
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas non interdum enim, non
      varius orci. Vivamus mi justo, porttitor vel tempor nec, aliquam et augue. Aliquam finibus,
      est vel ornare cursus, enim quam viverra arcu, vel faucibus nulla enim tristique felis.
      Aliquam erat volutpat. Duis malesuada augue nunc, ultrices condimentum sapien posuere vel.
      Pellentesque maximus diam quis ipsum volutpat fringilla.
    </p>
  );
}

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "UI/ContentBlock",
  component: ContentBlock,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof ContentBlock>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ContentBlock> = args => <ContentBlock {...args} />;

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  children: <GreekingText />,
};

export const WithColorClass = Template.bind({});
WithColorClass.args = {
  colorClass: "bg-emerald-200",
  children: <GreekingText />,
};
