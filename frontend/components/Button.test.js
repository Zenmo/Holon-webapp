import { render, screen, fireEvent } from "@testing-library/react";

import Button from "./Button";

describe("Button", () => {
  it("triggers onClick when clicked", () => {
    const onClick = jest.fn();

    render(<Button onClick={onClick}>Click me</Button>);
    fireEvent.click(screen.getByRole("button", { name: "Click me" }));

    expect(onClick.mock.calls.length).toBe(1);
  });

  describe("with the default variant", () => {
    it("renders with the default styles", () => {
      render(<Button>Click me</Button>);

      const button = screen.getByRole("button", { name: "Click me" });

      expect(button.classList.contains("bg-white")).toBe(true);
      expect(button.classList.contains("text-gray-700")).toBe(true);
    });

    it("renders icons in a lighter shade", () => {
      render(
        <Button>
          <Button.Icon>
            <div data-testid="icon">Icon</div>
          </Button.Icon>
          Click me
        </Button>
      );

      const button = screen.getByTestId("icon");
      expect(button.classList.contains("text-gray-400")).toBe(true);
    });
  });

  describe("with the primary variant", () => {
    it("renders with the default styles", () => {
      render(<Button variant="primary">Click me</Button>);

      const button = screen.getByRole("button", { name: "Click me" });

      expect(button.classList.contains("bg-blue-600")).toBe(true);
      expect(button.classList.contains("text-white")).toBe(true);
    });

    it("renders icons in a lighter shade", () => {
      render(
        <Button variant="primary">
          <Button.Icon>
            <div data-testid="icon">Icon</div>
          </Button.Icon>
          Click me
        </Button>
      );

      const button = screen.getByTestId("icon");
      expect(button.classList.contains("text-blue-200")).toBe(true);
    });
  });

  describe("with no variant specified", () => {
    it("renders with the default styles", () => {
      render(<Button>Click me</Button>);

      const button = screen.getByRole("button", { name: "Click me" });

      expect(button.classList.contains("bg-white")).toBe(true);
      expect(button.classList.contains("text-gray-700")).toBe(true);
    });

    it("renders icons in a lighter shade", () => {
      render(
        <Button>
          <Button.Icon>
            <div data-testid="icon">Icon</div>
          </Button.Icon>
          Click me
        </Button>
      );

      const button = screen.getByTestId("icon");
      expect(button.classList.contains("text-gray-400")).toBe(true);
    });
  });

  describe("rendering an Icon outside of a button", () => {
    it("throws an error", () => {
      expect(() => {
        render(
          <Button.Icon>
            <div>Something</div>
          </Button.Icon>
        );
      }).toThrow(/must be used within a Button/);
    });
  });
});
