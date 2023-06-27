const API_KEY = process.env.NEXT_PUBLIC_TINY_URL_API_KEY;

export async function createTinyUrl(url: string) {
  let body = {
    url: url,
  };

  const response = await fetch("https://api.tinyurl.com/create", {
    method: "POST",
    headers: {
      accept: "application/json",
      authorization: `Bearer ${API_KEY}`,
      "content-type": `application/json`,
    },
    body: JSON.stringify(body),
  });

  if (response.status !== 200) {
    throw `There was a problem with the fetch operation. Status Code: ${response.status}`;
  }

  const responseData = await response.json();
  const shortUrl = responseData.data.tiny_url;

  if (!shortUrl) {
    throw `There was a problem with fetching the shortUrl.`;
  }

  return shortUrl;
}
