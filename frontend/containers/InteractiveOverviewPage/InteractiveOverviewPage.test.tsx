import { render, /* screen */ } from '@testing-library/react';
import InteractiveOverviewPage from './';
// import data from './InteractiveOverviewPage.data';

describe('<InteractiveOverviewPage />', () => {
    it('Renders an empty InteractiveOverviewPage', () => {
        render(<InteractiveOverviewPage />);
    });

    // it('Renders InteractiveOverviewPage with data', () => {
    //     const { container } = render(<InteractiveOverviewPage {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
});