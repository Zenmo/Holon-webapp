  export type DataColorsProps = {
    color: string;
    name: string;
  };
  export type CostBenefitChartProps = {
    chartdata: Array<object>;
    detailData?: Array<object>;
    dataColors: DataColorsProps[];
    ignoredLabels: Array<string>;
  };