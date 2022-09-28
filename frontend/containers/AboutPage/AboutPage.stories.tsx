/* global module */

import React from 'react';
import AboutPage from './AboutPage';
import data from './AboutPage.data';

export default {
    title: 'Components/AboutPage',
    component: AboutPage,
};

export const AboutPageWithoutData = () => <AboutPage />;
export const AboutPageWithData = () => <AboutPage {...data} />;
