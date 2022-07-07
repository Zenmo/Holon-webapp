import Head from "next/head";

import ContentBlock from "../components/ContentBlock";
import FeedbackBlock from "../components/FeedbackBlock";
import HolonButton from "../components/Buttons/HolonButton";
import IntroductionVideo from "../components/IntroductionVideo";
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
        <ContentBlock>
          <WelcomePage></WelcomePage>
        </ContentBlock>
        <ContentBlock colorClass="bg-split-white-blue"></ContentBlock>
        <ContentBlock colorClass="bg-holon-blue-900" id="introVideo">
          <IntroductionVideo />
        </ContentBlock>
        <ContentBlock colorClass="bg-split-blue-white"></ContentBlock>
        <ContentBlock id="start">
          <TextBlock value="hoeDoen" borderColor="border-holon-slated-blue-300"></TextBlock>
        </ContentBlock>
        <ContentBlock>
          <TextBlock
            value="slimmerSamenwerken"
            borderColor="border-holon-gold-200"
            right="true"
          ></TextBlock>
        </ContentBlock>
        <ContentBlock>
          <TextBlock value="warmte" borderColor="border-holon-blue-900"></TextBlock>
        </ContentBlock>
        <ContentBlock>
          <TextBlock
            value="tweeKeerSlimmer"
            borderColor="border-holon-gold-600"
            right="true"
          ></TextBlock>
        </ContentBlock>
        <ContentBlock>
          <TextBlock
            value="afsluiter"
            underlineTitle="true"
            colorUnderline="decoration-holon-slated-blue-300"
          >
            <HolonButton tag="a" href="" variant="blue">
              Naar het open model
            </HolonButton>
            <HolonButton tag="a" href="" variant="blue">
              Op de hoogte blijven
            </HolonButton>
          </TextBlock>
        </ContentBlock>
        <ContentBlock colorClass="bg-split-white-blue"></ContentBlock>
        <ContentBlock colorClass="bg-holon-blue-900">
          <FeedbackBlock />
        </ContentBlock>
      </main>
    </div>
  );
}
