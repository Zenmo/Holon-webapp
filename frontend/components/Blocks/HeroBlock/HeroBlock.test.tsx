import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import HeroBlock from "./";

describe("<HeroBlock />", () => {
  describe("with video media", () => {
    beforeEach(async () => {
      await act(() => {
        render(
          <HeroBlock
            data={{
              type: "unknown",
              value: {
                alt_text: "Some alt text",
                backgroundColor: "bg-emerald-100",
                media: [
                  {
                    type: "video",
                    value: "/video",
                    id: "",
                    altText: "",
                  },
                ],
                buttonBlock: [],
                text: "Lorem ipsum",
                title: "Hello world",
              },
              id: "a-hero-block",
            }}
          />
        ).container;
      });
    });

    it("renders a header", () => {
      const heading = screen.getByRole("heading");

      expect(heading.tagName).toEqual("H1");
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("Hello world");
    });

    it("renders text", () => {
      const heading = screen.getByTestId("content");

      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("Lorem ipsum");
    });

    it("renders text", () => {
      const content = screen.getByTestId("content");

      expect(content).toBeInTheDocument();
      expect(content).toHaveTextContent("Lorem ipsum");
    });

    it("renders a video player", () => {
      const media = screen.getByTestId("video-player");
      expect(media).toBeInTheDocument();
    });
  });

  describe("with image media", () => {
    beforeEach(async () => {
      await act(() => {
        render(
          <HeroBlock
            data={{
              type: "unknown",
              value: {
                alt_text: "Some alt text",
                backgroundColor: "bg-emerald-100",
                media: [
                  {
                    type: "image",
                    value: {
                      img: { src: "http://localhost:3000/video", width: 1, height: 1, alt: "Alt" },
                      id: 1,
                      title: "Some image",
                      alt: "some alt text",
                    },
                  },
                ],
                altText: "alternative alt text",
                buttonBlock: [],
                text: "Lorem ipsum",
                title: "Hello world",
              },
              id: "a-hero-block",
            }}
          />
        ).container;
      });
    });

    it("renders a header", () => {
      const heading = screen.getByRole("heading");

      expect(heading.tagName).toEqual("H1");
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("Hello world");
    });

    it("renders text", () => {
      const heading = screen.getByTestId("content");

      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("Lorem ipsum");
    });

    it("renders text", () => {
      const content = screen.getByTestId("content");

      expect(content).toBeInTheDocument();
      expect(content).toHaveTextContent("Lorem ipsum");
    });

    it("renders an image", () => {
      const media = screen.getByRole("img");
      expect(media).toBeInTheDocument();
    });
  });
});
