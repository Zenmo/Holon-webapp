/* global module */

import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"

import WikiPage from "./WikiPage"

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "Components/WikiPage",
    component: WikiPage,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {},
} as ComponentMeta<typeof WikiPage>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof WikiPage> = args => <WikiPage {...args} />

export const Default = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
    richText: "Hello!",
    wikiMenu: {
        items: [],
        meta: { totalCount: 0 },
    },
}
