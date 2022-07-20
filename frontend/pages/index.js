import Head from "next/head";
import Scenarios from "../components/Scenarios/Scenarios";

import ContentBlock from "../components/ContentBlock";
import FeedbackBlock from "../components/FeedbackBlock";
import HolonButton from "../components/Buttons/HolonButton";
import IntroductionVideo from "../components/IntroductionVideo/IntroductionVideo";
import TextBlock from "../components/TextBlock";
import WelcomePage from "../components/WelcomePage";

export default function Home() {
  return (
    <div>
      <Head>
        <title>HOLON en de kunst van het Loslaten</title>
        <meta name="description" content="HOLON en de kunst van het Loslaten" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="h-screen snap-y snap-mandatory overflow-y-auto">
        <ContentBlock id="openModel">
          <Scenarios
            scenarioid="5"
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
          />
        </ContentBlock>
        <ContentBlock colorClass="bg-split-white-blue"></ContentBlock>
        <ContentBlock colorClass="bg-holon-blue-900" id="feedback">
          <FeedbackBlock />
        </ContentBlock>
      </main>
    </div>
  );
}
