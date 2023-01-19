import { render, screen } from "@testing-library/react";
import NewPasswordRequest from "./index";

describe("<NewPasswordRequest />", () => {
  describe("NewPasswordRequest", () => {
    beforeEach(() => {
      render(<NewPasswordRequest />);
    });

    it("renders a request new password form", () => {
      const form = screen.getByTestId("request-new-password");
      expect(form).toBeInTheDocument();
    });
  });
});
