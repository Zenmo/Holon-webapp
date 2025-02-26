import { render /* screen */ } from "@testing-library/react"
import BestPracticePage from "./"
// import data from './BestPracticePage.data';

describe("<BestPracticePage />", () => {
    it("Renders an empty BestPracticePage", () => {
        render(<BestPracticePage />)
    })

    // it('Renders BestPracticePage with data', () => {
    //     const { container } = render(<BestPracticePage {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
})
