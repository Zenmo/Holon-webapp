import { render, screen } from "@testing-library/react";
import CardBlock from "./";

describe("<CardBlock />", () => {
  describe("cardblock", () => {
    beforeEach(() => {
      render(
        <CardBlock
          data={{
            type: "cardBlock",
            value: {
              cards: [],
              buttonBlock: [],
            },
            id: "4",
          }}
        />
      );
    });

    it("renders a cardblock", () => {
      expect(screen.getByTestId("cardblock")).toBeInTheDocument();
    });
  });

  describe("with a buttonblock", () => {
    beforeEach(() => {
      render(
        <CardBlock
          data={{
            type: "cardBlock",
            value: {
              cards: [],
              buttonBlock: [
                {
                  type: "buttons",
                  value: {
                    buttonsAlign: "btn-center",
                    buttons: [
                      {
                        type: "button",
                        value: {
                          buttonStyle: "light",
                          buttonText: "Klik me",
                          buttonLink: [
                            {
                              type: "extern",
                              value: "http://www.test.nl",
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

    it("renders a buttonblock", () => {
      const button = screen.getByRole("link");
      expect(button).toBeInTheDocument();
    });

    it("with an external link", () => {
      const button = screen.getByRole("link");
      expect(button).toHaveAttribute("href", "http://www.test.nl");
      expect(button).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("with correct style", () => {
      const button = screen.getByRole("link");
      expect(button).toHaveClass("bg-white");
    });

    it("is outlined correctly", () => {
      const div = screen.getByRole("link").closest("div");
      expect(div).toHaveClass("justify-center");
    });
  });
});
