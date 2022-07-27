import { render, screen } from "@testing-library/react";

import IntroductionVideo from "./IntroductionVideo";

describe("IntroductionVideo", () => {
  describe("renders a video", () => {
    it("shows a video", () => {
      render(<IntroductionVideo />);
      expect(screen.getByTestId("introductionvideo")).toBeInTheDocument();
    });
  });
});
