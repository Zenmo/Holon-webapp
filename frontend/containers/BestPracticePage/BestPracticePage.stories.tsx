/* global module */

import React from 'react';
import BestPracticePage from './BestPracticePage';
import data from './BestPracticePage.data';

export default {
    title: 'Components/BestPracticePage',
    component: BestPracticePage,
};

export const BestPracticePageWithoutData = () => <BestPracticePage />;
export const BestPracticePageWithData = () => <BestPracticePage {...data} />;
