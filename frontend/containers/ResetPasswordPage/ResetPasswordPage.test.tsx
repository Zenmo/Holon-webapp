import { render /* screen */ } from "@testing-library/react"
import ResetPasswordPage from "./"
// import data from './ResetPasswordPage.data';

describe("<ResetPasswordPage />", () => {
    it("Renders an empty ResetPasswordPage", () => {
        render(<ResetPasswordPage />)
    })

    // it('Renders ResetPasswordPage with data', () => {
    //     const { container } = render(<ResetPasswordPage {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
})
