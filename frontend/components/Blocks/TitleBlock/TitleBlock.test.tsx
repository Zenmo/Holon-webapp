import { render, screen } from "@testing-library/react";
import TitleBlock from "./";

describe("<TitleBlock />", () => {
  beforeEach(() => {
    render(
      <TitleBlock
        data={{
          type: "unknown",
          value: {
            backgroundColor: "block__bg-purple",
            title: "Hello world",
            size: "h2",
            text: "Lorem ipsum",
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
          id: "4",
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

  it("renders a link-button", () => {
    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent("xx");
    expect(link).toHaveAttribute("href", "http://www.test.com");
  });
});
