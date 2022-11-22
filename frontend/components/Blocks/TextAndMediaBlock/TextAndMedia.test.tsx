import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import TextAndMedia from "./";

describe("<TextAndMedia />", () => {
  describe("with video media", () => {
    beforeEach(async () => {
      await act(() => {
        render(
          <TextAndMedia
            data={{
              type: "textImageBlock",
              value: {
                gridLayout: {
                  grid: "50_50",
                },
                background: {
                  color: "block__bg-purple",
                  size: "bg__full",
                },
                text: "<h1>Title</h1><p>Lorem ipsum</p>",
                media: [
                  {
                    type: "video",
                    value: "/video",
                    id: "",
                  },
                ],
                alt_text: "Some alt text",
                buttonBlock: [],
              },
              id: "a-text-and-media-block",
            }}
          />
        ).container;
      });
    });

    it("renders a header", () => {
      const heading = screen.getByRole("heading");

      expect(heading.tagName).toEqual("H1");
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("Title");
    });

    it("renders text", () => {
      expect(screen.getByText("Lorem ipsum")).toBeInTheDocument();
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
          <TextAndMedia
            data={{
              type: "textImageBlock",
              value: {
                gridLayout: {
                  grid: "50_50",
                },
                background: {
                  color: "block__bg-purple",
                  size: "bg__full",
                },
                text: "<h1>Title</h1><p>Lorem ipsum</p>",
                media: [
                  {
                    type: "image",
                    value: {
                      img: { src: "http://localhost:3000/video", width: 1, height: 1, alt: "Alt" },
                      id: 1,
                      title: "Some image",
                    },
                  },
                ],
                altText: "Some alt text",
                buttonBlock: [],
              },
              id: "a-text-and-media-block",
            }}
          />
        ).container;
      });
    });

    it("renders a header", () => {
      const heading = screen.getByRole("heading");

      expect(heading.tagName).toEqual("H1");
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("Title");
    });

    it("renders text", () => {
      expect(screen.getByText("Lorem ipsum")).toBeInTheDocument();
    });

    it("renders an image", () => {
      const media = screen.getByRole("img");

      expect(media).toBeInTheDocument();
    });

    it("renders an image with alt text", () => {
      const media = screen.getByRole("img");

      expect(media).toHaveAttribute("alt", "Some alt text");
    });
  });

  describe("with a link-button", () => {
    beforeEach(async () => {
      await act(() => {
        render(
          <TextAndMedia
            data={{
              type: "textImageBlock",
              value: {
                gridLayout: {
                  grid: "50_50",
                },
                background: {
                  color: "block__bg-purple",
                  size: "bg__full",
                },
                text: "<h1>Title</h1><p>Lorem ipsum</p>",
                media: [
                  {
                    type: "image",
                    value: {
                      img: { src: "http://localhost:3000/video", width: 1, height: 1, alt: "Alt" },
                      id: 1,
                      title: "Some image",
                    },
                  },
                ],
                alt_text: "Some alt text",
                buttonBlock: [
                  {
                    type: "buttons",
                    value: {
                      buttonsAlign: "btn-left",
                      buttons: [
                        {
                          type: "button",
                          value: {
                            buttonStyle: "dark",
                            buttonText: "xx",
                            buttonLink: [
                              {
                                type: "extern",
                                value: "http://www.test.com",
                                id: "1",
                              },
                            ],
                          },
                          id: "2",
                        },
                      ],
                    },
                    id: "3",
                  },
                ],
              },
              id: "a-text-and-media-block",
            }}
          />
        ).container;
      });
    });

    it("renders an image", () => {
      const media = screen.getByRole("img");
      expect(media).toBeInTheDocument();
    });

    it("renders a link-button", () => {
      const link = screen.getByRole("link");
      expect(link).toBeInTheDocument();
      expect(link).toHaveTextContent("xx");
      expect(link).toHaveAttribute("href", "http://www.test.com");
    });
  });

  describe("with the correct styling", () => {
    beforeEach(async () => {
      await act(() => {
        render(
          <TextAndMedia
            data={{
              type: "textImageBlock",
              value: {
                gridLayout: {
                  grid: "50_50",
                },
                background: {
                  color: "block__bg-purple",
                  size: "bg__left",
                },
                text: "<h1>Title</h1><p>Lorem ipsum</p>",
                media: [
                  {
                    type: "image",
                    value: {
                      img: { src: "http://localhost:3000/video", width: 1, height: 1, alt: "Alt" },
                      id: 1,
                      title: "Some image",
                    },
                  },
                ],
                alt_text: "Some alt text",
                buttonBlock: [],
              },
              id: "a-text-and-media-block",
            }}
          />
        ).container;
      });
    });

    it("has the chosen backgroundcolor", () => {
      expect(screen.getByTestId("textMedia")).toHaveClass("block__bg-purple");
    });

    it("has the chosen grid", () => {
      expect(screen.getByTestId("textMedia")).toHaveClass("lg:w-1/2");
    });
  });
});
