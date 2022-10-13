/* global module */

import React from 'react';
import StorylinePage from './StorylinePage';
import data from './StorylinePage.data';

export default {
    title: 'Components/StorylinePage',
    component: StorylinePage,
};

export const StorylinePageWithoutData = () => <StorylinePage />;
export const StorylinePageWithData = () => <StorylinePage {...data} />;
