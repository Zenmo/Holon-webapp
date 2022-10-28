import { getRequest, postRequest } from "./wagtail";
import * as Cookies from "es-cookie";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_WAGTAIL_API_URL;

export async function getHolonKPIs(data: {
  scenario: number;
  sliders: { slider: number; value: number }[];
}) {
  return await postRequest(`${NEXT_PUBLIC_API_URL}/v1/holon/`, data, {
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
  });
}
