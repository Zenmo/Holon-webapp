/* global module */

import React from 'react';
import CasusOverviewPage from './CasusOverviewPage';
import data from './CasusOverviewPage.data';

export default {
    title: 'Components/CasusOverviewPage',
    component: CasusOverviewPage,
};

export const CasusOverviewPageWithoutData = () => <CasusOverviewPage />;
export const CasusOverviewPageWithData = () => <CasusOverviewPage {...data} />;
