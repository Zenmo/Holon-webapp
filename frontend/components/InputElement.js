import React, { createContext, useContext } from "react";

const variants = {
  darkmode:"border-2 border-white bg-holon-blue-900 text-white",
  outline: "border border bg-white text-holon-blue-900  shadow-[4px_4px_0_0]"
};

const InputContext = createContext();

export default function InputElement({
  children,
  variant = "darkmode",
  placeholder = "defaultPlaceholder",
  id = "defaultId",
  label,
  type = "text",
  required = true,
  ...rest
}) {
  const colorClasses = variants[variant] || variants.darkmode;
  return (
    <div className="flex flex-col">
      {label &&
            <label className="ml-1 font-bold italic" htmlFor={`${id}`}>
              {`${label}`}
            </label>
      }
      <input
        className={`${colorClasses} mt-1 rounded-lg p-1 placeholder:font-light placeholder:italic placeholder:text-holon-slated-blue-300`}
        type={`${type}`}
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
