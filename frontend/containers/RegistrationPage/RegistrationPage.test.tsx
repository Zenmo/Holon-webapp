import { render, /* screen */ } from '@testing-library/react';
import RegistrationPage from './';
// import data from './RegistrationPage.data';

describe('<RegistrationPage />', () => {
    it('Renders an empty RegistrationPage', () => {
        render(<RegistrationPage />);
    });

    // it('Renders RegistrationPage with data', () => {
    //     const { container } = render(<RegistrationPage {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
});