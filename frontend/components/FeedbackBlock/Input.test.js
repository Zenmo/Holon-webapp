import { render, screen } from "@testing-library/react";

import Input from "./Input";

describe("Input", () => {
  describe("with a label and no errors", () => {
    it("has a labelled input", () => {
      render(<Input label="Name" />);
      expect(screen.getByLabelText(/Name/)).toBeInTheDocument();
    });

    it("renders no errors", () => {
      render(<Input label="Name" />);
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  describe("with errors", () => {
    beforeEach(() => {
      render(<Input label="Name" errors={["Error one", "Error two"]} />);
    });

    it("has a labelled input", () => {
      expect(screen.getByLabelText(/Name/)).toBeInTheDocument();
    });

    it("renders the errors", () => {
      expect(screen.queryByRole("alert", { text: "Error one Error two" })).toBeInTheDocument();
    });
  });
});
