import React from "react";

import { basePageWrap } from "../BasePage";
import Header from "@/components/VersionOne/Header/Header";
import IntroductionVideo from "@/components/VersionOne//IntroductionVideo/IntroductionVideo";
import HolonButton from "@/components/VersionOne//Buttons/HolonButton";
import TextBlock from "@/components/VersionOne//TextBlocks/TextBlock";
import ContentBlock from "@/components/VersionOne//ContentBlock/ContentBlock";
import Scenarios from "@/components/VersionOne//Scenarios/Scenarios";
import FeedbackBlock from "@/components/VersionOne//FeedbackBlock/FeedbackBlock";

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

      <ContentBlock>
        <TextBlock
          value="slimmerSamenwerken"
          borderColor="border-holon-gold-200"
          right={true}></TextBlock>
      </ContentBlock>

      <ContentBlock>
        <Scenarios
          scenarioId="2"
          locked
          scenarioTitle="De windcoöperatie"
          right
          borderColor="border-holon-gold-200"
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
          windholon={true}
          calculationResults={{
            reliability: {
              local: 0,
              national: 0,
            },
            affordability: {
              local: 2062,
              national: 2062,
            },
            renewability: {
              local: 16,
              national: 16,
            },
            selfconsumption: {
              local: 49,
              national: 49,
            },
          }}
        />
      </ContentBlock>

      <ContentBlock>
        <TextBlock value="warmte" borderColor="border-holon-blue-900"></TextBlock>
      </ContentBlock>

      <ContentBlock>
        <Scenarios
          scenarioId="3"
          locked
          scenarioTitle="De rol van warmte"
          borderColor="border-holon-blue-900"
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
          heatholon
          calculationResults={{
            reliability: {
              local: 100,
              national: 100,
            },
            affordability: {
              local: 2218,
              national: 2218,
            },
            renewability: {
              local: 14,
              national: 14,
            },
            selfconsumption: {
              local: 85,
              national: 85,
            },
          }}
        />
      </ContentBlock>

      <ContentBlock>
        <TextBlock
          value="tweeKeerSlimmer"
          borderColor="border-holon-gold-600"
          right={true}></TextBlock>
      </ContentBlock>

      <ContentBlock>
        <Scenarios
          scenarioId="4"
          locked
          scenarioTitle="Twee keer slimmer"
          borderColor="border-holon-gold-600"
          right
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
          windholon={true}
          heatholon={true}
          calculationResults={{
            reliability: {
              local: 100,
              national: 100,
            },
            affordability: {
              local: 1082,
              national: 1082,
            },
            renewability: {
              local: 32,
              national: 32,
            },
            selfconsumption: {
              local: 91,
              national: 91,
            },
          }}
        />
      </ContentBlock>

      <ContentBlock>
        <TextBlock value="afsluiter" underlineTitleBlue>
          <HolonButton tag="a" href="#openModel" variant="blue">
            Naar het open model
          </HolonButton>
          <HolonButton tag="a" href="#feedback" variant="blue">
            Op de hoogte blijven
          </HolonButton>
        </TextBlock>
      </ContentBlock>

      <ContentBlock id="openModel">
        <Scenarios
          scenarioId="5"
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
          windholon={true}
          calculationResults={{
            reliability: {},
            affordability: {},
            renewability: {},
            selfconsumption: {},
          }}
        />
      </ContentBlock>

      <ContentBlock colorClass="bg-split-white-blue"></ContentBlock>

      <ContentBlock colorClass="bg-holon-blue-900" id="feedback">
        <FeedbackBlock />
      </ContentBlock>
    </main>
  );
};

export default basePageWrap(HomePage);
