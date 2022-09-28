import React from 'react';
import {
    shallow,
    // mount
} from 'enzyme';

import Header from './';
// import data from './Header.data';

describe('<Header />', () => {
    it('Renders an empty Header', () => {
        const component = shallow(<Header />);
        expect(component).toBeTruthy();
    });

    // it('Renders Header with data', () => {
    //     const component = mount(<Header {...data} />);
    //     expect(component).toMatchSnapshot();
    // });
});
