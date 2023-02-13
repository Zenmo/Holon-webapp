/* global module */

import React from 'react';
import NewPasswordPage from './NewPasswordPage';
import data from './NewPasswordPage.data';

export default {
    title: 'Components/NewPasswordPage',
    component: NewPasswordPage,
};

export const NewPasswordPageWithoutData = () => <NewPasswordPage />;
export const NewPasswordPageWithData = () => <NewPasswordPage {...data} />;
