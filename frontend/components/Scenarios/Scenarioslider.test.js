import { render, screen, fireEvent } from "@testing-library/react";

import ScenarioSlider from "./Scenarioslider";

describe("ScenarioSlider", () => {
  describe("with a label and no errors", () => {
    // it("has a labelled input", () => {
    //   render(<ScenarioSlider label="Scenariolabel" />);
    //   expect(screen.getByLabelText(/Scenariolabel/)).toBeInTheDocument();
    // });
    it("has a default value", () => {
      render(<ScenarioSlider label="Scenariolabel" value={50} />);
      expect(screen.getByTestId("scenarioslider").value).toBe("50");
    });
    // it("updates the slider when the value changes", () => {
    //   render(<ScenarioSlider />);
    //   fireEvent.change(screen.getByTestId("scenarioslider"), { target: { value: 70 } });
    //   expect(screen.getByTestId("scenarioslider").value).toBe("70");
    // });
    // it("shows tooltip when hovering the info-icon", () => {
    //   render(<ScenarioSlider message="Lorem ipsum" />);
    //   // expect(screen.getByText("Lorem ipsum")).toBeInTheDocument();
    // });
  });
});
