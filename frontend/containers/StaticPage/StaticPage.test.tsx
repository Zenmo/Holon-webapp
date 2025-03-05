import { render /* screen */ } from "@testing-library/react"
import StaticPage from "./"
// import data from './StaticPage.data';

describe("<StaticPage />", () => {
    it("Renders an empty StaticPage", () => {
        render(<StaticPage />)
    })

    // it('Renders StaticPage with data', () => {
    //     const { container } = render(<StaticPage {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
})
