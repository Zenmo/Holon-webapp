import { render, screen } from "@testing-library/react";
import TitleBlock from "./";

describe("<TitleBlock />", () => {
  beforeEach(() => {
    render(
      <TitleBlock
        data={{
          type: "unknown",
          value: {
            backgroundColor: "bg-emerald-100",
            title: "Hello world",
            size: "h2",
            text: "Lorem ipsum",
          },
          id: "a-block",
        }}
      />
    );
  });

  it("renders a header", () => {
    const heading = screen.getByRole("heading");

    expect(heading.tagName).toEqual("H2");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Hello world");
  });

  it("renders the text content", () => {
    const content = screen.getByTestId("content");
    expect(content).toHaveTextContent("Lorem ipsum");
  });
});
