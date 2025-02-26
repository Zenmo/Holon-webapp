import { render /* screen */ } from "@testing-library/react"
import ChallengeModePage from "./"
// import data from './ChallengeModePage.data';

describe("<ChallengeModePage />", () => {
    it("Renders an empty ChallengeModePage", () => {
        render(<ChallengeModePage />)
    })

    // it('Renders ChallengeModePage with data', () => {
    //     const { container } = render(<ChallengeModePage {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
})
