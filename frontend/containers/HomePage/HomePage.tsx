import React from "react";

import { basePageWrap } from "../BasePage";
import Header from "../../components/Header/Header";
import IntroductionVideo from "../../components/IntroductionVideo/IntroductionVideo";
import TextBlock from "../../components/TextBlocks/TextBlock";
import ContentBlock from "../../components/ContentBlock/ContentBlock";
import Scenarios from "../../components/Scenarios/Scenarios";

const HomePage = () => {
  return (
    <main className="h-screen snap-y snap-mandatory overflow-y-auto">
      <Header />

      <ContentBlock colorClass="bg-holon-blue-900" id="introVideo">
        <IntroductionVideo />
      </ContentBlock>

      <ContentBlock colorClass="bg-split-blue-white"></ContentBlock>

      <ContentBlock id="start">
        <TextBlock value="hoeDoen" borderColor="border-holon-slated-blue-300"></TextBlock>
      </ContentBlock>

      <ContentBlock>
        <Scenarios
          scenarioId="1"
          locked
          scenarioTitle="Het moet anders"
          borderColor="border-holon-slated-blue-300"
          neighbourhood1={{
            heatpump: { value: 0, label: "Warmtepompen" },
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
          calculationResults={{
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
      </ContentBlock>
    </main>
  );
};

export default basePageWrap(HomePage);
