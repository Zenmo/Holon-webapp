import { render, screen } from "@testing-library/react";
import StorylineOverviewPage from "./";
import data from "./StorylineOverviewPage.data";

describe("<StorylineOverviewPage />", () => {
  it("Renders an empty StorylineOverviewPage", () => {
    render(<StorylineOverviewPage />);
  });

  it("Renders StorylineOverviewPage with data", async () => {
    render(<StorylineOverviewPage {...data} />);
    const filterInput = screen.getByRole("checkbox", {
      name: /Informatie 1/i,
    });
    expect(filterInput).toBeInTheDocument();
  });
});
