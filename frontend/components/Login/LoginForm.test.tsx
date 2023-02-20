import { render, screen } from "@testing-library/react";
import LoginForm from "./index";

describe("<Login form />", () => {
  describe("Login form", () => {
    beforeEach(() => {
      render(<LoginForm />);
    });

    it("renders a login form", () => {
      const form = screen.getByTestId("login-form");
      expect(form).toBeInTheDocument();
    });
  });
});
