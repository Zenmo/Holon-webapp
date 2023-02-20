/* global module */

import React from 'react';
import ResetPasswordPage from './ResetPasswordPage';
import data from './ResetPasswordPage.data';

export default {
    title: 'Components/ResetPasswordPage',
    component: ResetPasswordPage,
};

export const ResetPasswordPageWithoutData = () => <ResetPasswordPage />;
export const ResetPasswordPageWithData = () => <ResetPasswordPage {...data} />;
