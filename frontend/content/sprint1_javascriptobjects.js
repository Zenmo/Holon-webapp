wijk1_instellingen = {
  EV: { value: 70, unit: "%" },
  PV: { value: 40, unit: "%" },
  WP: { value: 0, unit: "%" },
  CV: { value: 100, unit: "%" },
  Warmtenet: { value: false, unit: "-" },
};

wijk2_instellingen = {
  EV: { value: 70, unit: "%" },
  PV: { value: 60, unit: "%" },
  WP: { value: 0, unit: "%" },
  CV: { value: 0, unit: "%" },
  Warmtenet: { value: true, unit: "-" },
};

holon_instellingen = {
  scenario1: { windholon: false, warmteholon: false },
  scenario2: { windholon: true, warmteholon: false },
  scenario3: { windholon: false, warmteholon: true },
  scenario4: { windholon: true, warmteholon: true },
};

scenario_results = {
  scenario1: {
    betrouwbaarheid: "+",
    betaalbaarheid: 2420,
    duurzaamheid: 7,
    zelfconsumptie: 58,
  },
  scenario2: {
    betrouwbaarheid: "-",
    betaalbaarheid: 2062,
    duurzaamheid: 16,
    zelfconsumptie: 49,
  },
  scenario3: {
    betrouwbaarheid: "+",
    betaalbaarheid: 2218,
    duurzaamheid: 14,
    zelfconsumptie: 85,
  },
  scenario4: {
    betrouwbaarheid: "+",
    betaalbaarheid: 1802,
    duurzaamheid: 32,
    zelfconsumptie: 91,
  },
};

kpi_kleurschaal = {
  betrouwbaarheid: {
    ondergrens: "-",
    bovengrens: "+",
  },
  betaalbaarheid: {
    ondergrens: 2400,
    bovengrens: 1800,
  },
  duurzaamheid: {
    ondergrens: 10,
    bovengrens: 50,
  },
  zelfconsumptie: {
    ondergrens: 40,
    bovengrens: 90,
  },
};

slider_info_popover = {
  EV: { text: "Het percentage van de auto's in de buurt dat elektrisch is." },
  WP: {
    text: "Het percentage van de huizen in de buurt die een elektrische warmtepomp hebben,",
  },
  PV: { text: "Het percentage van de huizen in de buurt die zonnepanelen heeft." },
  warmtenet: {
    text: "Als deze slider aangevinkt staat zijn alle huizen in de buurt aangesloten op een warmtenet. Het is een midden-temperatuur warmtenet. In de beginsituatie is de bron een gasketel. In de warmteholon situatie is de bron een warmtepomp met elektrische piekboiler, en een warmtebuffer die demand-response en seizoensopslag van warmte mogelijk maakt.",
  },
  warmteholon: {
    text: "De warmteholon is de coöperatie van buurtbewoners die aangesloten zijn op het warmtenet. Zij worden eigenaar van het warmtenet en regelen de centrale aansturing. Deze aansturing zorgt ervoor dat de overschotten zonne-energie van de holon leden gebruikt worden om de warmtepomp aan te zetten en buffer te vullen, en in combinatie met de windholon ook die overschotten te gebruiken. ",
  },
  windholon: {
    text: "De windholon is de coöperatie van buurtbewoners die samen gaat investeren in een windturbine. Om deze te mogen bouwen in een gebied met transportschaarste moeten de leden hun verbruik afstemmen op de opwek van de windturbine. Hiermee ontlasten ze het HS/MS-station waar de windturbine op aangesloten is.",
  },
};

kpi_info_popover = {
  lokaal: {
    betaalbaarheid:
      "De betaalbaarheid zijn de energiekosten per huishouden per jaar. Hierbij worden autobrandstoffen, aardgas, warmte en elektriciteit meegenomen. Van de duurzame bronnen die gebouwd worden in de buurten wordt de LCOE genomen zodat investeringen ook meetellen in de kosten. De overige elektriciteit gaat op basis van marktprijzen.",
    betrouwbaarheid:
      "Betrouwbaarheid wordt bepaald door overbelasting van het elektriciteitsnet. Bij een negatieve indicatie wordt het net regelmatig overbelast, bij een positieve indicatie is dit geen probleem.",
    duurzaamheid:
      "Het aandeel lokaal duurzaam opgewekte energie. Het verschilt met zelfvoorziening is dat voor het aandeel duurzaamheid de gelijktijdigheid van opwek en consumptie niet van belang is. De energie wordt als het ware ‘gesaldeerd’.",
    zelfconsumptie:
      "Zelfconsumptie is het aandeel van de lokaal opgewekte energie die ook gelijktijdig lokaal gebruikt wordt. Een hoge zelfconsumptie is nodig om netcongestie tegen te gaan door pieken in lokale (duurzame) opwek.",
  },
  nationaal: {
    betaalbaarheid:
      "De betaalbaarheid zijn de totale energiekosten van alle huishouden per jaar bij elkaar. Hierbij worden autobrandstoffen, aardgas, warmte en elektriciteit meegenomen. Van de duurzame bronnen die gebouwd worden in de buurten wordt de LCOE genomen zodat investeringen ook meetellen in de kosten. De overige elektriciteit gaat op basis van marktprijzen.",
    betrouwbaarheid:
      "Betrouwbaarheid wordt bepaald door overbelasting van het elektriciteitsnet. Bij een negatieve indicatie wordt het net regelmatig overbelast, bij een positieve indicatie is dit geen probleem.",
    duurzaamheid:
      "Het aandeel lokaal duurzaam opgewekte energie. Het verschilt met zelfvoorziening is dat voor het aandeel duurzaamheid de gelijktijdigheid van opwek en consumptie niet van belang is. De energie wordt als het ware ‘gesaldeerd’.",
    zelfconsumptie:
      "Zelfconsumptie is het aandeel van de lokaal opgewekte energie die ook gelijktijdig lokaal gebruikt wordt. Een hoge zelfconsumptie is nodig om netcongestie tegen te gaan door pieken in lokale (duurzame) opwek.",
  },
};

lokaal_nationaal_toggle_info_popover =
  "Het lokale schaalniveau laat de resultaten van de beschreven case met twee voorbeeldbuurten zien. Het nationale schaalniveau is een aggregatie van de indicatoren naar nationaal niveau door de buurten te vermenigvuldigen met het aantal huizen in Nederland. ";
