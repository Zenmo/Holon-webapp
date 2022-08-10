type LabelledValue<T> = {
  value: T;
  label: string;
};

export type Neighbourhood = {
  heatpump: LabelledValue<number>;
  evadoptation: LabelledValue<number>;
  solarpanels: LabelledValue<number>;
  heatnetwork: LabelledValue<boolean>;
};

export type SubjectResult =
  | {
      local: number;
      national: number;
    }
  | Record<string, never>;

export type CalculationResponseData = {
  local: {
    reliability: string;
    selfconsumption: string;
    affordability: string;
    renewability: string;
  };
  national: {
    reliability: string;
    selfconsumption: string;
    affordability: string;
    renewability: string;
  };
};
