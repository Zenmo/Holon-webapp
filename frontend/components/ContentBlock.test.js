import { getByTestId, render, screen } from "@testing-library/react";

import ContentBlock from "./ContentBlock";

describe("Content block", () => {
  it("renders a contentblock", () => {
    render(<ContentBlock />);
    expect(screen.getByTestId("content-block")).toBeInTheDocument();
  });
});

describe("with correct styling", () => {
  it("has the correct className", () => {
    render(<ContentBlock colorClass="bg-split-blue-white" />);
    const contentBlock = screen.getByTestId("content-block");

    expect(contentBlock).toHaveClass("bg-split-blue-white");
  });
});

describe("with content", () => {
  it("is rendered with content", () => {
    render(
      <ContentBlock>
        <div data-testid="child"></div>
      </ContentBlock>
    );

    const childBlock = screen.getByTestId("child");
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});
