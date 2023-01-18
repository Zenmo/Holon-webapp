import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import RegistrationForm from "./index";

describe("<RegistrationForm />", () => {
  describe("with video media", () => {
    beforeEach(async () => {
      await act(() => {
        render(<RegistrationForm />);
      });
    });

    it("renders a registration form", () => {
      const form = screen.getByTestId("registration-form");
      expect(form).toBeInTheDocument();
    });
  });
});
