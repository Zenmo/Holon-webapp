import { render, screen } from "@testing-library/react";
import Card from "./Card";

describe("<Card />", () => {
  describe("with all content", () => {
    beforeEach(() => {
      render(
        <Card
          cardItem={{
            title: "TestCard1",
            imageSelector: {
              id: 1,
              title: "Hello world",
              img: {
                src: "/image",
                width: 1600,
                height: 1600,
                alt: "",
              },
            },
            text: "TestText1",
            cardBackground: "card__bg-gray",
            cardLink: [
              {
                type: "extern",
                value: "http://www.link.com",
                id: "1",
              },
            ],
          }}
          cardType=""
        />
      );
    });

    it("renders a title", () => {
      const title = screen.getByText("TestCard1");
      expect(title).toBeInTheDocument();
    });

    it("renders a text", () => {
      const text = screen.getByText("TestText1");
      expect(text).toBeInTheDocument();
    });

    it("renders an image", () => {
      const media = screen.getByRole("img");
      expect(media).toBeInTheDocument();
    });

    it("renders a link", () => {
      const link = screen.getByRole("link");
      expect(link).toBeInTheDocument();
    });

    it("renders a link with the correct attributes", () => {
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "http://www.link.com");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("with correct styling", () => {
    beforeEach(() => {
      render(
        <Card
          cardItem={{
            title: "TestCard1",
            imageSelector: {
              id: 1,
              title: "Hello world",
              img: {
                src: "/image",
                width: 1600,
                height: 1600,
                alt: "",
              },
            },
            text: "TestText1",
            cardBackground: "card__bg-gray",
            cardLink: [
              {
                type: "extern",
                value: "http://www.link.com",
                id: "1",
              },
            ],
          }}
          cardType=""
        />
      );
    });

    it("has background color", () => {
      const element = screen.getByTestId("TestCard1");

      expect(element).toHaveClass("card__bg-gray");
    });

    it("renders a stetched link", () => {
      const link = screen.getByRole("link");
      expect(link).toHaveClass("stretched-link");
    });
  });
});
