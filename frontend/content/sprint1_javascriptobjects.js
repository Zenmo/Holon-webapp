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
  Scenario1: {
    Betrouwbaarheid: "+",
    Betaalbaarheid: 2420,
    Duurzaamheid: 7,
    Zelfconsumptie: 58,
  },
  Scenario2: {
    Betrouwbaarheid: "-",
    Betaalbaarheid: 2062,
    Duurzaamheid: 16,
    Zelfconsumptie: 49,
  },
  Scenario3: {
    Betrouwbaarheid: "+",
    Betaalbaarheid: 2218,
    Duurzaamheid: 14,
    Zelfconsumptie: 85,
  },
  Scenario4: {
    Betrouwbaarheid: "+",
    Betaalbaarheid: 1802,
    Duurzaamheid: 32,
    Zelfconsumptie: 91,
  },
};

kpi_kleurschaal = {
  Betrouwbaarheid: {
    ondergrens: "-",
    bovengrens: "+",
  },
  Betaalbaarheid: {
    ondergrens: 2400,
    bovengrens: 1800,
  },
  Duurzaamheid: {
    ondergrens: 10,
    bovengrens: 50,
  },
  Zelfconsumptie: {
    ondergrens: 40,
    bovengrens: 90,
  },
};
