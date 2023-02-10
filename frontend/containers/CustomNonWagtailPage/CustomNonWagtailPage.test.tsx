import { render, /* screen */ } from '@testing-library/react';
import CustomNonWagtailPage from './';
// import data from './CustomNonWagtailPage.data';

describe('<CustomNonWagtailPage />', () => {
    it('Renders an empty CustomNonWagtailPage', () => {
        render(<CustomNonWagtailPage />);
    });

    // it('Renders CustomNonWagtailPage with data', () => {
    //     const { container } = render(<CustomNonWagtailPage {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
});