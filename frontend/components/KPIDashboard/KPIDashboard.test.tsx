import { render, screen } from "@testing-library/react";
import KPIDashboard from "./KPIDashboard";

describe("<KPIDashboard", () => {
  describe("renders a KPIDashboard", () => {
    beforeEach(() => {
      render(
        <KPIDashboard
          data={{
            local: {
              Netbelasting: 20,
              Betaalbaarheid: 30,
              Duurzaamheid: 40,
              Zelfvoorzienendheid: 50,
            },
            national: {
              Netbelasting: 20,
              Betaalbaarheid: 30,
              Duurzaamheid: 40,
              Zelfvoorzienendheid: 50,
            },
          }}></KPIDashboard>
      );
    });

    it("renders a KPIDashboard", () => {
      const dashboard = screen.getByTestId("KPIDashboard");
      expect(dashboard).toBeInTheDocument();
    });
  });
});
