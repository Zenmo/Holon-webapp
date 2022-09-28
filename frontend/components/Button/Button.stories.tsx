/* global module */

import React from 'react';
import Button from './Button';
import data from './Button.data';

export default {
    title: 'Components/Button',
    component: Button,
};

export const ButtonWithoutData = () => <Button />;
export const ButtonWithData = () => <Button {...data} />;
