import { render /* screen */ } from "@testing-library/react"
import BestPracticeOverviewPage from "./"
// import data from './BestPracticeOverviewPage.data';

describe("<BestPracticeOverviewPage />", () => {
    it("Renders an empty BestPracticeOverviewPage", () => {
        render(<BestPracticeOverviewPage />)
    })

    // it('Renders BestPracticeOverviewPage with data', () => {
    //     const { container } = render(<BestPracticeOverviewPage {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
})
