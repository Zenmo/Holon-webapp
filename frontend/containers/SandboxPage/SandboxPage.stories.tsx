/* global module */

import React from 'react';
import SandboxPage from './SandboxPage';
import data from './SandboxPage.data';

export default {
    title: 'Components/SandboxPage',
    component: SandboxPage,
};

export const SandboxPageWithoutData = () => <SandboxPage />;
export const SandboxPageWithData = () => <SandboxPage {...data} />;
