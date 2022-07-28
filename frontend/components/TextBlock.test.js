import { render, screen } from "@testing-library/react";

import TextBlock from "./TextBlock";

describe("text block", () => {
  beforeEach(() => {
    render(<TextBlock value="warmte" />);
  });
  it("renders a text block", () => {
    expect(screen.getByTestId("text-block")).toBeInTheDocument();
  });
  it("has correct text", () => {
    expect(screen.getByText("De rol van warmte")).toBeInTheDocument();
  });
  it("contains an image", () => {
    expect(screen.getByRole("img")).toBeInTheDocument();
  });
});

describe("correct styling", () => {
  beforeEach(() => {
    render(
      <TextBlock
        value="warmte"
        right="true"
        underlineTitle="true"
        colorUnderline="decoration-holon-gold-600"
        borderColor="border-holon-gold-600"
      ></TextBlock>
    );
  });
  it("is outlined on the right side", () => {
    expect(screen.getByTestId("outlined-block").classList.contains("items-end")).toBe(true);
  });
  it("title is underlined", () => {
    expect(screen.getByRole("heading", { level: 2 }).classList.contains("shadow-blue")).toBe(true);
  });
  it("is underlined in the correct color", () => {
    expect(screen.getByRole("heading", { level: 2 })).toHaveStyle("text-decoration-color: #C89D28");
  });
  it("has a border", () => {
    expect(screen.getByTestId("outlined-block").classList.contains("border-solid")).toBe(true);
  });
  it("border has the correct color", () => {
    expect(screen.getByTestId("outlined-block").classList.contains("border-holon-gold-600")).toBe(
      true
    );
  });
});

describe("append child", () => {
  it("appends child element", () => {
    render(
      <TextBlock value="warmte">
        <h3>title</h3>
      </TextBlock>
    );
    expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
  });
});
