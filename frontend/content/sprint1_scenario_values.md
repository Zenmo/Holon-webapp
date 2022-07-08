# Instellingen voor scenario's

## Wijkinstellingen
*Wijkinstellingen zijn hetzelfde in alle scenario's behalve de holoninstellingen*
### Wijk 1
 | slider    | waarde | eenheid |
 | --------- | ------ | ------- |
 | EV        | 70     | %       |
 | PV        | 40     | %       |
 | WP        | 0      | %       |
 | CV ketel  | 100    | %       |
 | Warmtenet | false  | -       |

### Wijk 2
 | slider    | waarde | eenheid |
 | --------- | ------ | ------- |
 | EV        | 70     | %       |
 | PV        | 60     | %       |
 | WP        | 0      | %       |
 | CV ketel  | 0      | %       |
 | Warmtenet | true   | -       |

## Holoninstellingen
 | slider     | windholon | warmteholon |
 | ---------- | --------- | ----------- |
 | Scenario 1 | false     | false       |
 | Scenario 2 | true      | false       |
 | Scenario 3 | false     | true        |
 | Scenario 4 | true      | true        |


``` javascript
wijk1_instellingen = {
  EV: { value: 70, unit: "%" },
  PV: { value: 40, unit: "%" },
  WP: { value: 0, unit: "%" },
  CV: { value: 100, unit: "%" },
  warmtenet: { value: false, unit: "-" },
};

wijk2_instellingen = {
  EV: { value: 70, unit: "%" },
  PV: { value: 60, unit: "%" },
  WP: { value: 0, unit: "%" },
  CV: { value: 0, unit: "%" },
  warmtenet: { value: true, unit: "-" },
};

holon_instellingen = {
  scenario1: { windholon: false, warmteholon: false },
  scenario2: { windholon: true, warmteholon: false },
  scenario3: { windholon: false, warmteholon: true },
  scenario4: { windholon: true, warmteholon: true },
};
```

# Resultaten

## Lokale resultaten

| b          | Betrouwbaarheid | Betaalbaarheid   €/hh/y | Duurzaamheid % | Zelfconsumptie % |
| ---------- | --------------- | ----------------------- | -------------- | ---------------- |
| Scenario 1 | +               | 2420                    | 7              | 58               |
| Scenario 2 | -               | 2062                    | 16             | 49               |
| Scenario 3 | +               | 2218                    | 14             | 85               |
| Scenario 4 | +               | 1802                    | 32             | 91               |

## Nationale resultaten

 | b          | Betrouwbaarheid | Betaalbaarheid   €/hh/y | Duurzaamheid % | Zelfconsumptie % |
 | ---------- | --------------- | ----------------------- | -------------- | ---------------- |
 | Scenario 1 | +               | 2420                    | 7              | 58               |
 | Scenario 2 | -               | 2062                    | 16             | 49               |
 | Scenario 3 | +               | 2218                    | 14             | 85               |
 | Scenario 4 | +               | 1802                    | 32             | 91               |


## Kleurschalen
| b           | Betrouwbaarheid | Betaalbaarheid   €/hh/y | Duurzaamheid % | Zelfconsumptie % |
| ----------- | --------------- | ----------------------- | -------------- | ---------------- |
| Rood-level  | -               | 2400                    | 10             | 40               |
| Groen-level | +               | 1800                    | 50             | 90               |



```javascript
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
```