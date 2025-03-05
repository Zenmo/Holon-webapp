import { render /* screen */ } from "@testing-library/react"
import SandboxPage from "./"
// import data from './SandboxPage.data';

describe("<SandboxPage />", () => {
    it("Renders an empty SandboxPage", () => {
        render(<SandboxPage />)
    })

    // it('Renders SandboxPage with data', () => {
    //     const { container } = render(<SandboxPage {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
})
