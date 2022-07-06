import { useState, useEffect } from "react";

import { RadioGroup } from "@headlessui/react";
import EmoticonButton from "./EmoticonButton";

export default function Sentiment() {
  const [choice, setChoice] = useState(null);

  useEffect(() => {
    setChoice(localStorage.getItem("holon_sentiment_value") || null)
  })

  const onChange = (selected) => {
    if (!selected) {
      return;
    }

    let method = "POST"
    let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/rating/`
    if (localStorage.getItem("holon_sentiment_value") && localStorage.getItem("holon_sentiment_id")) {
      method = "PUT"
      url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/rating/${localStorage.getItem("holon_sentiment_id")}/`
    }

    fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: method,
      body: JSON.stringify({ rating: selected.toUpperCase() }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("HTTP error " + response.status);
        }
        return response.json();
      })
      .then(json => {
        localStorage.setItem("holon_sentiment_value", (json.rating).toLowerCase())
        localStorage.setItem("holon_sentiment_id", json.id)
      })
      .then(() => setChoice(selected))
      .catch(() => {});
  };

  return (
    <RadioGroup
      value={choice}
      onChange={onChange}
      className="flex w-full justify-center gap-6 pt-12 pb-24"
    >
      <RadioGroup.Label className="sr-only">What did you think?</RadioGroup.Label>
      <RadioGroup.Option value="heart">
        {({ checked }) => <EmoticonButton variant="heart" checked={checked} />}
      </RadioGroup.Option>
      <RadioGroup.Option value="thumbsup">
        {({ checked }) => <EmoticonButton variant="thumbsup" checked={checked} />}
      </RadioGroup.Option>
      <RadioGroup.Option value="neutral">
        {({ checked }) => <EmoticonButton variant="even" checked={checked} />}
      </RadioGroup.Option>
      <RadioGroup.Option value="thumbsdown">
        {({ checked }) => <EmoticonButton variant="thumbsdown" checked={checked} />}
      </RadioGroup.Option>
    </RadioGroup>
  );
}
