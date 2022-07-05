import { useState } from "react";

import { RadioGroup } from "@headlessui/react";
import EmoticonButton from "./EmoticonButton";

export default function Sentiment() {
  const [choice, setChoice] = useState();

  const onChange = (selected) => {
    if (!selected) {
      return;
    }

    setChoice(selected);

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/update-ratings/`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ rating: selected }),
    })
      .then(() => {})
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
