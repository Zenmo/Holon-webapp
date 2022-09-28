/* global module */

import React from 'react';
import Header from './Header';
import data from './Header.data';

export default {
    title: 'Components/Header',
    component: Header,
};

export const HeaderWithoutData = () => <Header />;
export const HeaderWithData = () => <Header {...data} />;
