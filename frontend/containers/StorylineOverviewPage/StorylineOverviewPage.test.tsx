import { render /* screen */ } from "@testing-library/react";
import StorylineOverviewPage from "./";
import data from "./StorylineOverviewPage.data";

describe("<StorylineOverviewPage />", () => {
  it("Renders an empty StorylineOverviewPage", () => {
    render(<StorylineOverviewPage />);
  });

  it("Renders StorylineOverviewPage with data", () => {
    const { container } = render(<StorylineOverviewPage {...data} />);
    expect(container).toMatchSnapshot();
  });
});
