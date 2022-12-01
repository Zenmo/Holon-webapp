import { render, screen } from "@testing-library/react";
import Header from "./Header";

describe("<Header />", () => {
  beforeEach(() => {
    render(
      <Header
        data={{
          navigation: [
            {
              name: "test",
              slug: "test",
            },
            {
              name: "test2",
              slug: "test2",
            },
          ],
        }}
      />
    );
  });

  it("renders a header", () => {
    const header = screen.getByRole("navigation");
    expect(header).toBeInTheDocument();
  });
});
