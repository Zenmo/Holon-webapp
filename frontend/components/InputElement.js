import React, { createContext, useContext } from "react";

const InputContext = createContext();

export default function InputElement({
  children,
  placeholder = "defaultPlaceholder",
  id = "defaultId",
  label = "defaultLabel",
  required = true,
  ...rest
}) {
  return (
    <div className="flex flex-col">
      <label className="ml-1 font-bold italic" htmlFor={`${id}`}>
        {`${label}`}
      </label>
      <input
        className="mt-1 rounded-lg border-2 border-white bg-holon-blue-900 p-1 text-white placeholder:font-light placeholder:italic placeholder:text-holon-slated-blue-300 "
        type="text"
        id={`${id}`}
        required={`${required}`}
        placeholder={`${placeholder}`}
      />
    </div>
  );
}

/**
 * Hook which provides access to the input variant.
 */
export function useInputContext() {
  const context = useContext(InputContext);

  if (!context) {
    throw new Error("useInputContext must be used within a Input");
  }

  return context;
}
