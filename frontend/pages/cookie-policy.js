import ContentBlock from "../components/ContentBlock";

export default function CookiePolicy() {
  return (
    <div>
      <ContentBlock>
        <div className="prose mt-6 flex flex-col [&>a]:inline [&>a]:underline">
          <h1 id="cookie-policy">Cookie Policy</h1>
          <p>
            <a href="http://Holontool.nl" className="inline">
              Holontool.nl
            </a>{" "}
            gebruikt verschillende soorten cookies. Omdat het belangrijk is voor jou als gebruiker
            hier controle over te hebben, leggen we op deze pagina uit welke cookies we inzetten en
            voor welk doel.
          </p>
          <h2 id="wat-zijn-cookies">Wat zijn cookies?</h2>
          <p>
            Cookies zijn kleine tekst bestanden die een website op jouw computer, tablet of mobiel
            plaatst wanneer je de website bezoekt. Deze bestanden houden informatie bij over je
            bezoek op de website. Dit zorgt er bijvoorbeeld voor dat de volgende keer dat je naar
            dezelfde website gaat, deze je herkent als bekende gebruiker.
          </p>
          <h2 id="welke-cookies-gebruiken-we">Welke cookies gebruiken we?</h2>
          <ol>
            <li>
              <p>Functionele cookies</p>
              <p>
                Er worden altijd functionele cookies geplaatst. Deze cookies zijn nodig om de
                website goed te laten werken.
              </p>
            </li>
            <li>
              <p>Niet-functionele cookies</p>
              <p>
                Naast functionele cookies plaatst{" "}
                <a className="inline" href="http://holontool.nl">
                  holontool.nl
                </a>{" "}
                ook standaard analytische cookies. Standaard analytische cookies zijn
                niet-functionele cookies, omdat ze niet noodzakelijk zijn om de website goed te
                laten werken.
              </p>
            </li>
          </ol>
          <h2 id="analytische-cookies">Analytische cookies</h2>
          <p>
            Analytische cookies helpen eigenaren van websites begrijpen hoe bezoekers hun website
            gebruiken, door gegevens te verzamelen en te rapporteren.
          </p>
          <table>
            <thead>
              <tr>
                <th>Naam</th>
                <th>Aanbieder</th>
                <th>Doel</th>
                <th>Vervaltermijn</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>collect</td>
                <td>
                  <a className="inline" href="http://google-analytics.com">
                    google-analytics.com
                  </a>
                </td>
                <td>
                  Wordt gebruikt om gegevens over het apparaat en het gedrag van de bezoeker naar
                  Google Analytics te sturen. Volgt de bezoeker op verschillende apparaten en
                  marketingkanalen.
                </td>
                <td>Sessie</td>
                <td>Pixel</td>
              </tr>
            </tbody>
          </table>
          <h2 id="google-analytics">Google Analytics</h2>
          <p>
            Deze website maakt gebruik van Google Analytics, een webanalyse-service die wordt
            aangeboden door Google Inc. (Google). Wij gebruiken deze dienst om bij te houden hoe
            bezoekers de website gebruiken, met als doel de website te verbeteren. Voor dit doel
            worden cookies geplaatst. Deze informatie wordt overgebracht naar Google. Google slaat
            deze gegevens vervolgens op in servers in de Verenigde Staten. Google gebruikt deze
            informatie om bij te houden hoe onze websites gebruikt worden, om rapporten over de
            websites aan ons te kunnen verstrekken. Wij hebben Google Analytics privacy-vriendelijk
            ingesteld. Onder meer wordt het IP-adres gepseudonimiseerd voordat dit gegeven wordt
            verzonden aan Google. Daarnaast hebben wij met Google een verwerkersovereenkomst
            gesloten op grond waarvan het Google niet is toegestaan deze gegevens aan derden te
            verstrekken of voor andere Google-diensten in te zetten. De maximale bewaartermijn van
            de cookies die middels deze dienst worden gebruikt is door ons ingesteld op 24 maanden.
            Dit betekent dat na afloop van deze termijn de gegevens niet meer kunnen worden
            uitgelezen. De verwerking van jouw persoonsgegevens via Google Analytics is gebaseerd op
            ons gerechtvaardigde belang om algemene statistieken van onze websitebezoekers te
            verkrijgen.
          </p>
          <span>
            Lees voor meer informatie het
            <a className="inline" href="https://policies.google.com/privacy?hl=nl">
              privacybeleid
            </a>{" "}
            van Google en het
            <a className="inline" href="https://support.google.com/analytics/answer/6004245?hl=nl">
              specifieke privacybeleid
            </a>
            van Google Analytics. Klik{" "}
            <a className="inline" href="https://tools.google.com/dlpage/gaoptout">
              hier
            </a>{" "}
            voor meer informatie over de opt-out regeling van Google.
          </span>
          <h2 id="cookies-blokkeren-en-verwijderen">Cookies blokkeren en verwijderen</h2>
          <p>
            Je kunt cookies zelf aanzetten of uitzetten in de instellingen van je browser. Meer
            informatie over het verwijderen en weigeren van cookies vind je op de website van de
            <a
              className="inline"
              href="https://www.consumentenbond.nl/internet-privacy/cookies-verwijderen"
            >
              Consumentenbond
            </a>
            .
          </p>
          <h2 id="over-deze-cookieverklaring">Over deze cookieverklaring</h2>
          <p>
            <a className="inline" href="http://Holontool.nl">
              Holontool.nl
            </a>{" "}
            mag deze cookieverklaring aanpassen, bijvoorbeeld omdat onze websites of de regels rond
            cookies wijzigen. Je kunt de actuele versie van deze cookieverklaring raadplegen door
            onderaan elke pagina te klikken op de link cookieverklaring.
          </p>
        </div>
      </ContentBlock>
    </div>
  );
}
