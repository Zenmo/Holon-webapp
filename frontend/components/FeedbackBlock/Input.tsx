import { forwardRef } from "react";

function ErrorMessages({ messages }: { messages: string[] }) {
  return (
    <div className="-mb-1 pt-1 text-red-400" role="alert">
      {messages.join(", ")}
    </div>
  );
}

type Props = {
  label: string;
  errors?: string[];
} & React.InputHTMLAttributes<HTMLInputElement>;

/**
 * Contains a label and input field. Inputs where `required` is not truthy will have "Optional"
 * added to the label.
 */
// function Input({ label, ...inputProps }) {
const Input = forwardRef<HTMLInputElement, Props>(({ label, errors, ...inputProps }, ref) => (
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
    {errors && <ErrorMessages messages={errors} />}
  </label>
));

Input.displayName = "Input";

export default Input;
