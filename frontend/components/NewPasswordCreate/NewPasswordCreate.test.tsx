import { render, screen } from "@testing-library/react";
import NewPasswordCreate from "./index";

describe("<NewPasswordCreate />", () => {
  describe("NewPasswordCreate", () => {
    beforeEach(() => {
      render(<NewPasswordCreate />);
    });

    it("renders a create new password form", () => {
      const form = screen.getByTestId("create-new-password-form");
      expect(form).toBeInTheDocument();
    });
  });
});
