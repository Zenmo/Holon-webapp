import { render, screen } from "@testing-library/react";

import Scenarios from "./Scenarios";

describe("Scenario", () => {
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
            national: 100,
          },
          affordability: {
            local: 2420,
            national: 2420,
          },
          renewability: {
            local: 7,
            national: 7,
          },
          selfconsumption: {
            local: 58,
            national: 58,
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
  it("it shows the correct values in neighbourhood A", () => {
    expect(screen.getByTestId("scenariosliderheatpumpA1", { value: 45 })).toBeInTheDocument();
    expect(screen.getByTestId("scenariosliderevadoptationA1", { value: 70 })).toBeInTheDocument();
    expect(screen.getByTestId("scenarioslidersolarpanelsA1", { value: 40 })).toBeInTheDocument();
    expect(screen.getByTestId("scenarioswitchheatnetworkA1")).not.toBeChecked();
  });
  it("it shows the correct values in neighbourhood B", () => {
    expect(screen.getByTestId("scenariosliderheatpumpB1", { value: 45 })).toBeInTheDocument();
    expect(screen.getByTestId("scenariosliderevadoptationB1", { value: 70 })).toBeInTheDocument();
    expect(screen.getByTestId("scenarioslidersolarpanelsB1", { value: 40 })).toBeInTheDocument();
    expect(screen.getByTestId("scenarioswitchheatnetworkB1")).toBeChecked();
  });
  it("it shows the correct value for heatholon", () => {
    expect(screen.getByTestId("heatholon1")).not.toBeChecked();
  });
  it("it shows the correct value for windholon", () => {
    expect(screen.getByTestId("windholon1")).toBeChecked();
  });
  it("it shows the correct scenarioresults", () => {
    expect(screen.getByTestId("resultBetrouwbaarheid")).toHaveTextContent("✔");
    expect(screen.getByTestId("resultBetaalbaarheid")).toHaveTextContent("2420");
    expect(screen.getByTestId("resultZelfconsumptie")).toHaveTextContent("58");
    expect(screen.getByTestId("resultDuurzaamheid")).toHaveTextContent("7");
  });
});
