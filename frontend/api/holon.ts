import { getRequest, postRequest } from "./wagtail";
import * as Cookies from "es-cookie";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_WAGTAIL_API_URL;

export async function getHolonKPIs(data: {
  interactiveElements: { interactiveElement: number; value: number | string | string[] | number }[];
}) {
  const { json } = await postRequest(`${NEXT_PUBLIC_API_URL}/v1/holon/`, data, {
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
  });

  return json;
}
