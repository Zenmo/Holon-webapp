/* global module */

import React from 'react';
import CustomNonWagtailPage from './CustomNonWagtailPage';
import data from './CustomNonWagtailPage.data';

export default {
    title: 'Components/CustomNonWagtailPage',
    component: CustomNonWagtailPage,
};

export const CustomNonWagtailPageWithoutData = () => <CustomNonWagtailPage />;
export const CustomNonWagtailPageWithData = () => <CustomNonWagtailPage {...data} />;
