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
