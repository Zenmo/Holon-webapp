/* global module */

import React from 'react';
import BestPracticeOverviewPage from './BestPracticeOverviewPage';
import data from './BestPracticeOverviewPage.data';

export default {
    title: 'Components/BestPracticeOverviewPage',
    component: BestPracticeOverviewPage,
};

export const BestPracticeOverviewPageWithoutData = () => <BestPracticeOverviewPage />;
export const BestPracticeOverviewPageWithData = () => <BestPracticeOverviewPage {...data} />;
