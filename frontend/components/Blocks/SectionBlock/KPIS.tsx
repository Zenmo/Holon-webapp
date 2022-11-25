import { useMemo, useState } from "react";
import { Content, InteractiveContent } from "./SectionBlock";
import { debounce } from "lodash";
import { getHolonKPIs } from "../../../api/holon";

export type Props = {
  content: Content[];
};

export type InteractiveElement = {
  interactiveElement: number;
  value: number | string | string[] | number;
};

function KPIS({ content }: Props) {
  const [kpis, setKPIs] = useState({});

  const interactiveElements = content
    .filter(
      (element): element is InteractiveContent =>
        element.type == "interactive_input" && !!element.currentValue
    )
    .map((element): InteractiveElement => {
      return {
        interactiveElement: element.value.id,
        value: element.currentValue,
      };
    });

  const calculateKPIs = () => {
    if (!interactiveElements || interactiveElements.length === 0) return;
    getHolonKPIs({ interactiveElements: interactiveElements }).then(res => {
      setKPIs(res);
    });
  };

  const debouncedCalculateKPIs = useMemo(() => debounce(calculateKPIs, 2000), []);

  debouncedCalculateKPIs();
  return null;
}

export default KPIS;
