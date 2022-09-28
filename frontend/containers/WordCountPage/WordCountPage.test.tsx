import { render, /* screen */ } from '@testing-library/react';
import WordCountPage from './';
// import data from './WordCountPage.data';

describe('<WordCountPage />', () => {
    it('Renders an empty WordCountPage', () => {
        render(<WordCountPage />);
    });

    // it('Renders WordCountPage with data', () => {
    //     const { container } = render(<WordCountPage {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
});