import { render, /* screen */ } from '@testing-library/react';
import NewPasswordPage from './';
// import data from './NewPasswordPage.data';

describe('<NewPasswordPage />', () => {
    it('Renders an empty NewPasswordPage', () => {
        render(<NewPasswordPage />);
    });

    // it('Renders NewPasswordPage with data', () => {
    //     const { container } = render(<NewPasswordPage {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
});