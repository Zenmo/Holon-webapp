import { httpGet } from "@/utils/Http";
import * as Cookies from "es-cookie";
import { postRequest } from "./wagtail";

const API_URL = process.env.NEXT_PUBLIC_WAGTAIL_API_URL || "/wt/api/nextjs";

export type InteractiveElement = {
  interactiveElement: number;
  value: number | string | string[] | number;
};

export async function getHolonKPIs(data: { interactiveElements: InteractiveElement[] }) {
  const { json } = await postRequest(`${API_URL}/v2/holon/`, data, {
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
  });

  return json;
}

export async function getHolonDataSegments() {
  return await httpGet(`/api/dummy-kosten-baten`);
}

export async function getHolonDataSegmentsDetail() {
  return await httpGet(`/api/dummy-kosten-baten`);
}
