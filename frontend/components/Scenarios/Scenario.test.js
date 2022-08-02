import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";

import Scenarios from "./Scenarios";

async function recalculate() {
  const submitEl = screen.getByRole("button");

  fetchMock.mockResponse(
    JSON.stringify({
      local: {
        reliability: 100,
        affordability: 2420,
        renewability: 7,
        selfconsumption: 58,
      },
      national: {
        reliability: 100,
        affordability: 2420,
        renewability: 7,
        selfconsumption: 58,
      },
    })
  );

  return await act(async () => {
    fireEvent.click(submitEl);
  });
}

describe("Scenario", () => {
  describe("locked version", () => {
    beforeEach(() => {
      render(
        <Scenarios
          scenarioid="1"
          locked
          scenarioTitle="The title of the scenario"
          borderColor="border-holon-slated-blue-300"
          neighbourhood1={{
            heatpump: { value: 45, label: "Warmtepompen" },
            evadoptation: { value: 70, label: "Elektrische auto's" },
            solarpanels: { value: 40, label: "Zonnepanelen" },
            heatnetwork: { value: false, label: "Warmtenet" },
          }}
          neighbourhood2={{
            heatpump: { value: 0, label: "Warmtepompen" },
            evadoptation: { value: 70, label: "Elektrische auto's" },
            solarpanels: { value: 60, label: "Zonnepanelen" },
            heatnetwork: { value: true, label: "Warmtenet" },
          }}
          windholon={true}
          calculationresults={{
            reliability: {
              local: 100,
              national: 0,
            },
            affordability: {
              local: 2420,
              national: 4220,
            },
            renewability: {
              local: 7,
              national: 70,
            },
            selfconsumption: {
              local: 58,
              national: 85,
            },
          }}
        />
      );
    });

    it("is locked", () => {
      expect(screen.getByTestId("scenariofieldset")).toBeDisabled();
    });
    it("is shows the title", () => {
      expect(screen.getByText("The title of the scenario")).toBeInTheDocument();
    });
    it("shows the correct values in neighbourhood A", () => {
      expect(screen.getByTestId("scenariosliderheatpumpA1", { value: 45 })).toBeInTheDocument();
      expect(screen.getByTestId("scenariosliderevadoptationA1", { value: 70 })).toBeInTheDocument();
      expect(screen.getByTestId("scenarioslidersolarpanelsA1", { value: 40 })).toBeInTheDocument();
      expect(screen.getByTestId("scenarioswitchheatnetworkA1")).not.toBeChecked();
    });
    it("shows the correct values in neighbourhood B", () => {
      expect(screen.getByTestId("scenariosliderheatpumpB1", { value: 45 })).toBeInTheDocument();
      expect(screen.getByTestId("scenariosliderevadoptationB1", { value: 70 })).toBeInTheDocument();
      expect(screen.getByTestId("scenarioslidersolarpanelsB1", { value: 40 })).toBeInTheDocument();
      expect(screen.getByTestId("scenarioswitchheatnetworkB1")).toBeChecked();
    });
    it("shows the correct value for heatholon", () => {
      expect(screen.getByTestId("heatholon1")).not.toBeChecked();

      fireEvent.click(screen.getByTestId("heatholon1"));
      expect(screen.getByTestId("heatholon1")).toBeChecked();
    });
    it("shows the correct value for windholon", () => {
      expect(screen.getByTestId("windholon1")).toBeChecked();

      fireEvent.click(screen.getByTestId("windholon1"));
      expect(screen.getByTestId("heatholon1")).not.toBeChecked();
    });
    it("shows the correct scenarioresults", () => {
      expect(screen.getByTestId("resultBetrouwbaarheid")).toHaveTextContent("✔");
      expect(screen.getByTestId("resultBetaalbaarheid")).toHaveTextContent("2420");
      expect(screen.getByTestId("resultDuurzaamheid")).toHaveTextContent("7");
      expect(screen.getByTestId("resultZelfconsumptie")).toHaveTextContent("58");
    });

    it("scenarioresults change when switching from Local to National ", () => {
      fireEvent.click(screen.getByTestId("scenarioswitchlocal1"));

      expect(screen.getByTestId("resultBetrouwbaarheid")).toHaveTextContent("✗");
      expect(screen.getByTestId("resultBetaalbaarheid")).toHaveTextContent("4220");
      expect(screen.getByTestId("resultDuurzaamheid")).toHaveTextContent("70");
      expect(screen.getByTestId("resultZelfconsumptie")).toHaveTextContent("85");
    });
  });

  describe("unlocked version", () => {
    beforeEach(() => {
      render(
        <Scenarios
          scenarioid="2"
          scenarioTitle="The title of the scenario"
          borderColor="border-holon-slated-blue-300"
          neighbourhood1={{
            heatpump: { value: 45, label: "Warmtepompen" },
            evadoptation: { value: 70, label: "Elektrische auto's" },
            solarpanels: { value: 40, label: "Zonnepanelen" },
            heatnetwork: { value: false, label: "Warmtenet" },
          }}
          neighbourhood2={{
            heatpump: { value: 0, label: "Warmtepompen" },
            evadoptation: { value: 70, label: "Elektrische auto's" },
            solarpanels: { value: 60, label: "Zonnepanelen" },
            heatnetwork: { value: true, label: "Warmtenet" },
          }}
          windholon={true}
          calculationresults={{
            reliability: {
              local: 100,
              national: 0,
            },
            affordability: {
              local: 2420,
              national: 4220,
            },
            renewability: {
              local: 7,
              national: 70,
            },
            selfconsumption: {
              local: 58,
              national: 85,
            },
          }}
        />
      );
    });
    it("is not locked", () => {
      expect(screen.getByTestId("scenariofieldset")).not.toBeDisabled();
    });
    it("updates legal and social texts when changing Holons", async () => {
      expect(screen.getByTestId("legalText")).toHaveTextContent("Flexibele tarieven voor");
      expect(screen.getByTestId("socialText")).toHaveTextContent(
        "De buurtbewoners ervaren lokaal eigenaarschap"
      );
      fireEvent.click(screen.getByTestId("windholon2"));
      expect(screen.getByTestId("legalText")).not.toHaveTextContent("Flexibele tarieven voor");
      expect(screen.getByTestId("socialText")).not.toHaveTextContent(
        "De buurtbewoners ervaren lokaal eigenaarschap"
      );
    });
    it("shows reacalculate button", async () => {
      expect(screen.queryByText("Herbereken")).toBeInTheDocument();
    });
    it("hides reacalculate button afer clicking it", async () => {
      fireEvent.click(screen.getByRole("button"));
      expect(screen.queryByText("Herbereken")).not.toBeInTheDocument();
    });
    it("wants to recalculate after an input changed", async () => {
      fireEvent.click(screen.getByRole("button"));
      expect(screen.queryByText("Herbereken")).not.toBeInTheDocument();
      fireEvent.change(screen.getByTestId("scenariosliderheatpumpA2"), { target: { value: 88 } });
      expect(screen.queryByText("Herbereken")).toBeInTheDocument();
    });
    it("submits the data to an API endpoint", async () => {
      await recalculate();
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });
    it("correctly renders the response", async () => {
      expect(screen.getByTestId("resultZelfconsumptie")).toHaveTextContent("58");
    });
  });
});
