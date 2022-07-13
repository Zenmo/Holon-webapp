import { useReducer, useRef } from "react";
import PropTypes from "prop-types";
import Link from "next/link"; 

import { MailIcon } from "@heroicons/react/outline";

import ButtonLoadingIcon from "./ButtonLoadingIcon";
import HolonButton from "../Buttons/HolonButton";
import Input from "./Input";

/**
 * Submit button for the form sets its style and text based on the state of the form.
 */
function SubmitButton({ status, ...buttonProps }) {
  let content = "Bevestig";

  if (status === "pending") {
    content = <ButtonLoadingIcon />;
  } else if (status === "success") {
    content = "Met dank!";
  }

  return (
    <HolonButton
      className="flex h-12 items-center justify-center text-lg"
      disabled={status === "pending" || status === "success"}
    >
      {content}
    </HolonButton>
  );
}

SubmitButton.propTypes = {
  status: PropTypes.oneOf(["initial", "pending", "success", "failed"]).isRequired,
};

function reducer(state, action) {
  switch (action.type) {
    case "fetch":
      return { status: "pending", errors: {} };
    case "resolve":
      return { status: "success", errors: {} };
    case "reject":
      return { status: "failed", errors: action.errors || {} };
    default:
      return state;
  }
}

export default function SubscriptionForm() {
  const [state, dispatch] = useReducer(reducer, { status: "initial", errors: {} });

  const nameRef = useRef();
  const emailRef = useRef();
  const companyRef = useRef();

  const onSubmit = async (event) => {
    event.preventDefault();

    dispatch({ type: "fetch" });

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

  const areInputsDisabled = state.status === "pending" || state.status === "success";

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-wrap items-start pb-6 md:flex-nowrap">
        <div className="px-6 pt-1 pb-3 text-center text-2xl leading-relaxed md:w-1/2 md:pb-0">
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
      <div className="flex flex-col w-full justify-center items-center pb-16">
        <SubmitButton status={state.status} />
        <p className="text-center text-xs">
          Met het indienen van deze informatie stemt u in met onze 
            <Link href="/privacy">
              <a className="underline">
                privacyverklaring
              </a>
            </Link>
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
