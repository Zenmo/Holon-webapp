import { render /* screen */ } from "@testing-library/react"
import StorylinePage from "./"
// import data from './StorylinePage.data';

describe("<StorylinePage />", () => {
    it("Renders an empty StorylinePage", () => {
        render(<StorylinePage />)
    })

    // it('Renders StorylinePage with data', () => {
    //     const { container } = render(<StorylinePage {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
})
