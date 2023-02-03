/* global module */

import React from 'react';
import InteractiveOverviewPage from './InteractiveOverviewPage';
import data from './InteractiveOverviewPage.data';

export default {
    title: 'Components/InteractiveOverviewPage',
    component: InteractiveOverviewPage,
};

export const InteractiveOverviewPageWithoutData = () => <InteractiveOverviewPage />;
export const InteractiveOverviewPageWithData = () => <InteractiveOverviewPage {...data} />;
