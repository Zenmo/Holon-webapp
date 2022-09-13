import React, { useReducer, useRef } from "react";

import { MailIcon } from "@heroicons/react/outline";

import ButtonLoadingIcon from "./ButtonLoadingIcon";
import HolonButton from "../Buttons/HolonButton";
import Input from "./Input";

interface State {
  status: "idle" | "loading" | "success" | "error";
  errors: Record<string, string[]>;
}

type Action =
  | {
      type: "fetch" | "resolve";
    }
  | {
      type: "reject";
      errors?: Record<string, string[]>;
    };

/**
 * Submit button for the form sets its style and text based on the state of the form.
 */
function SubmitButton({ status }: { status: State["status"] }) {
  let content: React.ReactNode = "Bevestig";

  if (status === "loading") {
    content = <ButtonLoadingIcon />;
  } else if (status === "success") {
    content = "Met dank!";
  }

  return (
    <HolonButton
      className="flex h-12 items-center justify-center text-lg"
      disabled={status === "loading" || status === "success"}
    >
      {content}
    </HolonButton>
  );
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "fetch":
      return { status: "loading", errors: {} };
    case "resolve":
      return { status: "success", errors: {} };
    case "reject":
      return { status: "error", errors: action.errors || {} };
    default:
      return state;
  }
}

export default function SubscriptionForm() {
  const [state, dispatch] = useReducer(reducer, { status: "idle", errors: {} });

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const companyRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    dispatch({ type: "fetch" });

    if (!nameRef.current || !emailRef.current || !companyRef.current) {
      return;
    }

    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      company: companyRef.current.value,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/update-registrations/`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(payload),
      });

      const json = await response.json();

      if (response.status >= 400 && response.status < 500) {
        dispatch({ type: "reject", errors: json });
      } else {
        dispatch({ type: "resolve" });
      }
    } catch {
      dispatch({ type: "reject" });
    }
  };

  const areInputsDisabled = state.status === "loading" || state.status === "success";

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col flex-wrap items-center pb-6 md:flex-row md:flex-nowrap md:items-start">
        <div className="px-6 pt-1 pb-3 text-center text-xl leading-relaxed sm:text-2xl md:w-1/2 md:pb-0">
          We houden je graag op de hoogte van verdere ontwikkelingen. Af en toe zullen we je vragen
          te vertellen wat je van het project tot dan toe vindt.
        </div>
        <div className="px-6 md:w-1/2">
          <Input
            label="Naam"
            type="text"
            name="name"
            required
            disabled={areInputsDisabled}
            ref={nameRef}
            errors={state.errors.name}
          />
          <Input
            label="E-mailadres"
            type="email"
            name="email"
            required
            disabled={areInputsDisabled}
            ref={emailRef}
            errors={state.errors.email}
          />
          <Input
            label="Bedrijf/Instelling"
            type="text"
            name="company"
            disabled={areInputsDisabled}
            ref={companyRef}
            errors={state.errors.company}
          />
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-center pb-10 sm:pb-16">
        <SubmitButton status={state.status} />
        <p className="mt-6 text-center text-xs">
          Met het indienen van deze informatie stem je in met onze&nbsp;
          <a className="inline underline" href="/privacy" target="_blank" rel="noreferrer noopener">
            privacyverklaring
          </a>
        </p>
      </div>
      <p className="flex w-full justify-center text-base">
        <a
          href="mailto:hallo@holontool.nl"
          className="inline-flex items-center p-2 text-white hover:text-white"
        >
          <MailIcon className="mr-1 h-6 w-6" />
          hallo@holontool.nl
        </a>
      </p>
    </form>
  );
}
