import { NextApiRequest, NextApiResponse } from "next";

const API_KEY = process.env.NEXT_PUBLIC_TINY_URL_API_KEY;

export default async function createTinyUrl(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.body;
  try {
    const response = await fetch("https://api.tinyurl.com/create", {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${API_KEY}`,
        "content-type": `application/json`,
      },
      body: JSON.stringify({ url }),
    });

    if (response.status !== 200) {
      throw new Error(
        `There was a problem with the fetch operation. Status Code: ${response.status}`
      );
    }

    const responseData = await response.json();
    const shortUrl = responseData.data.tiny_url;

    if (!shortUrl) {
      throw new Error(`There was a problem with fetching the shortUrl.`);
    }

    return res.status(200).json({ shortUrl });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
