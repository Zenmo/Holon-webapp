import { forwardRef, useReducer, useRef } from "react";
import PropTypes from "prop-types";

import { MailIcon } from "@heroicons/react/outline";

import ButtonLoadingIcon from "./ButtonLoadingIcon";
import HolonButton from "../Buttons/HolonButton";

/**
 * Contains a label and input field. Inputs where `required` is not truthy will have "Optional"
 * added to the label.
 */
// function Input({ label, ...inputProps }) {
const Input = forwardRef(({ label, ...inputProps }, ref) => (
  <label className="block pb-3">
    <span className="block items-baseline pb-1 text-base">
      <span className="font-semibold">{label}</span>
      {!inputProps.required && (
        <span className="ml-3 text-sm text-holon-slated-blue-300">optioneel</span>
      )}
    </span>
    <input
      {...inputProps}
      ref={ref}
      className="w-full rounded-md border-2 border-white bg-transparent p-2 text-base shadow-inner outline-none transition focus:bg-holon-blue-500/50 disabled:opacity-50"
    />
  </label>
));

Input.displayName = "Input";

Input.propTypes = {
  label: PropTypes.string.isRequired,
};

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
      return { status: "pending" };
    case "resolve":
      return { status: "success" };
    case "reject":
      return { status: "failed" };
    default:
      return state;
  }
}

export default function SubscriptionForm() {
  const [state, dispatch] = useReducer(reducer, { status: "initial" });

  const nameRef = useRef();
  const emailRef = useRef();
  const companyRef = useRef();

  const onSubmit = (event) => {
    event.preventDefault();

    dispatch({ type: "fetch" });

    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      company: companyRef.current.value,
    };

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/update-registrations/`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(payload),
    })
      .then(() => dispatch({ type: "resolve" }))
      .catch(() => dispatch({ type: "reject" }));
  };

  const areInputsDisabled = state.status === "pending" || state.status === "success";

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-wrap items-center pb-6 md:flex-nowrap">
        <div className="px-6 pb-3 text-center text-2xl leading-relaxed md:w-1/2 md:pb-0">
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
          />
          <Input
            label="E-mailadres"
            type="email"
            name="email"
            required
            disabled={areInputsDisabled}
            ref={emailRef}
          />
          <Input
            label="Bedrijf/Instelling"
            type="text"
            name="company"
            disabled={areInputsDisabled}
            ref={companyRef}
          />
        </div>
      </div>
      <div className="flex w-full justify-center pb-16">
        <SubmitButton status={state.status} />
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
