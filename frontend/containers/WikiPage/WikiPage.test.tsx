import { render, /* screen */ } from '@testing-library/react';
import WikiPage from './';
// import data from './WikiPage.data';

describe('<WikiPage />', () => {
    it('Renders an empty WikiPage', () => {
        render(<WikiPage />);
    });

    // it('Renders WikiPage with data', () => {
    //     const { container } = render(<WikiPage {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
});