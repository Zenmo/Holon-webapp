import { httpGet } from "@/utils/Http";
import * as Cookies from "es-cookie";
import { postRequest } from "./wagtail";

const API_URL = process.env.NEXT_PUBLIC_WAGTAIL_API_URL || "/wt/api/nextjs";

export type InteractiveElement = {
  interactiveElement: number;
  value: number | string | string[] | number[];
};

export type SimulationInput = {
  interactiveElements: InteractiveElement[],
  scenario: number,
}

export type KPIQuad = {
  netload: number | null
  costs: number | null
  sustainability: number | null
  selfSufficiency: number | null
}

export type SimulationResult = {
  dashboardResults: {
    local: KPIQuad
    intermediate: KPIQuad
    national: KPIQuad
  }
  costBenefitResults: Record<string, unknown>
}

export async function getHolonKPIs(data: SimulationInput): Promise<SimulationResult> {
  const {json} = await postRequest(`${API_URL}/v2/holon/`, data, {
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
  });

  return json;
};

export async function cacheCheck(data: SimulationInput): Promise<boolean> {
  const {json} = await postRequest(`${API_URL}/v2/cache_check/`, data, {
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
  });

  return json.isCached;
};

export async function getHolonDataSegments() {
  return await httpGet(`/api/dummy-kosten-baten`);
}

export async function getHolonDataSegmentsDetail() {
  return await httpGet(`/api/dummy-kosten-baten`);
}
