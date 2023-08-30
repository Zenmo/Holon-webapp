import { render, screen } from "@testing-library/react";
import StorylineOverview from "./StorylineOverview";

describe("<StorylineOverview />", () => {
  describe("renders an empty StorylineOverview", () => {
    beforeEach(() => {
      render(<StorylineOverview storylines={[]} allInformationTypes={[{}]} allRoles={[{}]} />);
    });

    it("renders an storyline overview", () => {
      const overview = screen.getByTestId("storyline-overview");
      expect(overview).toBeInTheDocument();
    });
  });

  describe("renders a storylineoverview with a StorylineCard", () => {
    beforeEach(() => {
      render(
        <StorylineOverview
          storylines={[
            {
              cardColor: "card__bg-blue",
              description: "x",
              informationTypes: [],
              roles: [],
              slug: "test",
              thumbnail: {
                url: "/img",
                width: 1,
                height: 1,
              },
              title: "test1",
            },
          ]}
          allInformationTypes={[{}]}
          allRoles={[{}]}
        />
      );
    });

    it("renders an storyline card", () => {
      const card = screen.getByTestId("test1");
      expect(card).toBeInTheDocument();
    });

    it("renders a title", () => {
      const title = screen.getByText("test1");
      expect(title).toBeInTheDocument();
    });

    it("renders a text", () => {
      const text = screen.getByText("x");
      expect(text).toBeInTheDocument();
    });

    it("renders a text", () => {
      const text = screen.getByText("x");
      expect(text).toBeInTheDocument();
    });

    it("renders a link", () => {
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "test");
    });

    it("has the selected background color", () => {
      const card = screen.getByTestId("test1");

      expect(card).toHaveClass("card__bg-blue");
    });

    it("renders a stetched link", () => {
      const link = screen.getByRole("link");
      expect(link).toHaveClass("stretched-link");
    });
  });
});
