import { InteractiveElement } from "@/components/Blocks/SectionBlock/KPIS";
import * as Cookies from "es-cookie";
import { postRequest } from "./wagtail";

const API_URL = process.env.NEXT_PUBLIC_WAGTAIL_API_URL;

export type InteractiveElement = {
  interactiveElement: number;
  value: number | string | string[] | number;
};

export async function getHolonKPIs(data: { interactiveElements: InteractiveElement[] }) {
  const { json } = await postRequest(`${API_URL}/v1/holon/`, data, {
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
  });

  return json;
}
