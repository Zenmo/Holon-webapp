import { render, /* screen */ } from '@testing-library/react';
import AboutPage from './';
// import data from './AboutPage.data';

describe('<AboutPage />', () => {
    it('Renders an empty AboutPage', () => {
        render(<AboutPage />);
    });

    // it('Renders AboutPage with data', () => {
    //     const { container } = render(<AboutPage {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
});