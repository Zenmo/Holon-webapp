import { render, screen } from "@testing-library/react";
import ButtonBlock from "./ButtonBlock";

describe("<ButtonBlock />", () => {
  describe("renders a buttonblock with internal link", () => {
    beforeEach(() => {
      render(
        <ButtonBlock
          buttons={[
            {
              type: "button",
              value: {
                buttonStyle: "light",
                buttonText: "Click me",
                buttonLink: [
                  {
                    type: "intern",
                    value: "/test",
                    id: "1",
                  },
                ],
              },
              id: "2",
            },
          ]}
          align="btn-center"
        />
      );
    });

    it("renders a button", () => {
      const button = screen.getByRole("link");
      expect(button).toBeInTheDocument();
    });

    it("renders an internal link", () => {
      const button = screen.getByRole("link");
      expect(button).toHaveAttribute("href", "/test");
    });

    it("with the correct attributes", () => {
      const button = screen.getByRole("link");
      expect(button).not.toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("button with external link", () => {
    beforeEach(() => {
      render(
        <ButtonBlock
          buttons={[
            {
              type: "button",
              value: {
                buttonStyle: "light",
                buttonText: "Click me",
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
          ]}
          align=""
        />
      );
    });

    it("renders an external link", () => {
      const button = screen.getByRole("link");
      expect(button).toHaveAttribute("href", "http://www.test.com");
    });

    it("with the correct attributes", () => {
      const button = screen.getByRole("link");
      expect(button).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("renders the selected style", () => {
    beforeEach(() => {
      render(
        <ButtonBlock
          buttons={[
            {
              type: "button",
              value: {
                buttonStyle: "light",
                buttonText: "Click me",
                buttonLink: [
                  {
                    type: "intern",
                    value: "/test",
                    id: "1",
                  },
                ],
              },
              id: "2",
            },
          ]}
          align="btn-center"
        />
      );
    });

    it("renders button with selected style", () => {
      const button = screen.getByRole("link");
      expect(button).toHaveClass("bg-holon-gold-200");
    });

    it("is outlined correctly", () => {
      const div = screen.getByRole("link").closest("div");
      expect(div).toHaveClass("justify-center");
    });
  });
});
