import { render, /* screen */ } from '@testing-library/react';
import CasusPage from './';
// import data from './CasusPage.data';

describe('<CasusPage />', () => {
    it('Renders an empty CasusPage', () => {
        render(<CasusPage />);
    });

    // it('Renders CasusPage with data', () => {
    //     const { container } = render(<CasusPage {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
});