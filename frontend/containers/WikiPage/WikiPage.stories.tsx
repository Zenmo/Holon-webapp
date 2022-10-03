/* global module */

import React from 'react';
import WikiPage from './WikiPage';
import data from './WikiPage.data';

export default {
    title: 'Components/WikiPage',
    component: WikiPage,
};

export const WikiPageWithoutData = () => <WikiPage />;
export const WikiPageWithData = () => <WikiPage {...data} />;
