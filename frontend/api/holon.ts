import { getRequest, postRequest } from "./wagtail";
import * as Cookies from "es-cookie";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_WAGTAIL_API_URL;

export async function getHolonKPIs(data: { scenario: number; slider: object[] }) {
  const res = await postRequest(`${NEXT_PUBLIC_API_URL}/v1/holon/`, JSON.stringify(data), {
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
  });

  return await res.json();
}
