import { render, /* screen */ } from '@testing-library/react';
import UserProfilePage from './';
// import data from './UserProfilePage.data';

describe('<UserProfilePage />', () => {
    it('Renders an empty UserProfilePage', () => {
        render(<UserProfilePage />);
    });

    // it('Renders UserProfilePage with data', () => {
    //     const { container } = render(<UserProfilePage {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
});