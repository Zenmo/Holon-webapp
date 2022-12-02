import { render, screen } from "@testing-library/react";
import StorylineOverview from "./StorylineOverview";

jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "",
      pathname: "",
      query: "",
      asPath: "",
    };
  },
}));

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
      const card = screen.getByTestId("storyline-card");
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
      expect(link).toHaveAttribute("href", "/test");
    });

    it("has the selected background color", () => {
      const link = screen.getByRole("link");

      expect(link).toHaveClass("card__bg-blue");
    });

    //Stretched link still needs to be added to storylinecard
    /* 
    it("renders a stetched link", () => {
      const link = screen.getByRole("link");
      expect(link).toHaveClass("stretched-link");
    });
    */
  });
});
