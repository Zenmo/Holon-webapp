/* global module */

import React from 'react';
import LoginPage from './LoginPage';
import data from './LoginPage.data';

export default {
    title: 'Components/LoginPage',
    component: LoginPage,
};

export const LoginPageWithoutData = () => <LoginPage />;
export const LoginPageWithData = () => <LoginPage {...data} />;
