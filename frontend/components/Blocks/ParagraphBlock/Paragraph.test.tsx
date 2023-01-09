import { render, screen } from "@testing-library/react";
import Paragraph from "./ParagraphBlock";

describe("ParagraphBlock", () => {
  beforeEach(() => {
    render(
      <Paragraph
        data={{
          type: "paragraphBlock",
          value: {
            gridLayout: {
              grid: "50_50",
            },
            background: {
              color: "block__bg-purple",
              size: "bg__left",
            },
            text: "<h1>Title</h1><p>Lorem ipsum</p>",
          },
          id: "a-paragraph-block",
        }}
      />
    );
  });

  it("has the chosen backgroundcolor", () => {
    expect(screen.getByTestId("paragraph")).toHaveClass("block__bg-purple");
  });

  it("has the chosen grid", () => {
    expect(screen.getByTestId("paragraph")).toHaveClass("lg:w-1/2");
  });
  it("renders a header", () => {
    const heading = screen.getByRole("heading");

    expect(heading.tagName).toEqual("H1");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Title");
  });

  it("renders text", () => {
    const text = screen.getByText("Lorem ipsum");
    expect(text).toBeInTheDocument();
  });
});
