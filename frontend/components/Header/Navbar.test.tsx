import { render, screen } from "@testing-library/react";
import Navbar from "./Navbar";

describe("<Navbar />", () => {
  beforeEach(() => {
    render(
      <Navbar
        items={[
          {
            title: "test",
            slug: "test",
          },
          {
            title: "test2",
            slug: "test2",
          },
        ]}
        loggedIn={false}
        nameUser="x"
      />
    );
  });

  it("renders a navbar", () => {
    const navbar = screen.getByRole("list");
    expect(navbar).toBeInTheDocument();
  });

  it("renders a list item", () => {
    const navitem = screen.getByRole("link", { name: "test" });
    expect(navitem).toBeInTheDocument();
  });

  it("renders a link to other page", () => {
    const navitem = screen.getByRole("link", { name: "test" });
    expect(navitem).toHaveAttribute("href", "/test");
  });
});
