/* global module */

import React from 'react';
import ChallengeModePage from './ChallengeModePage';
import data from './ChallengeModePage.data';

export default {
    title: 'Components/ChallengeModePage',
    component: ChallengeModePage,
};

export const ChallengeModePageWithoutData = () => <ChallengeModePage />;
export const ChallengeModePageWithData = () => <ChallengeModePage {...data} />;
