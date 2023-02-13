import { render, /* screen */ } from '@testing-library/react';
import LoginPage from './';
// import data from './LoginPage.data';

describe('<LoginPage />', () => {
    it('Renders an empty LoginPage', () => {
        render(<LoginPage />);
    });

    // it('Renders LoginPage with data', () => {
    //     const { container } = render(<LoginPage {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
});