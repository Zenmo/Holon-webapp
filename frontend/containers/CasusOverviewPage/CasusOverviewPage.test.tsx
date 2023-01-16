import { render, /* screen */ } from '@testing-library/react';
import CasusOverviewPage from './';
// import data from './CasusOverviewPage.data';

describe('<CasusOverviewPage />', () => {
    it('Renders an empty CasusOverviewPage', () => {
        render(<CasusOverviewPage />);
    });

    // it('Renders CasusOverviewPage with data', () => {
    //     const { container } = render(<CasusOverviewPage {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
});