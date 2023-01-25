import { render, screen } from "@testing-library/react";
import InteractiveInputs from "./InteractiveInputs";

const mockSetValue = jest.fn();

describe("<InteractiveInputs />", () => {
  describe("renders an Interactive input slider", () => {
    beforeEach(() => {
      render(
        <InteractiveInputs
          contentId="1"
          name="test"
          type="continuous"
          options={[
            {
              id: 1,
              sliderValueDefault: 6,

              sliderValueMax: 100,
            },
          ]}
          setValue={mockSetValue}
        />
      );
    });

    it("renders a interactive Input slider", () => {
      const input = screen.getByTestId("test");
      expect(input).toBeInTheDocument();
    });
  });
});
