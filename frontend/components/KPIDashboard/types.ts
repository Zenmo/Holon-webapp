export type KPIData = {
  local: {
    netload: number | null;
    costs: number | null;
    sustainability: number | null;
    selfSufficiency: number | null;
  };
  national: {
    netload: number | null;
    costs: number | null;
    sustainability: number | null;
    selfSufficiency: number | null;
  };
};
