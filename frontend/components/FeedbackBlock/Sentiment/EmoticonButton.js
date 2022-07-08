import React, { createContext, useContext } from "react";
import PropTypes from "prop-types";

const variants = {
  heart: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 122.88 107.39"
      className="ml-auto mr-auto mt-1 h-14 w-14"
      fill="currentColor"
    >
      <title>red-heart</title>
      <path d="M60.83,17.18c8-8.35,13.62-15.57,26-17C110-2.46,131.27,21.26,119.57,44.61c-3.33,6.65-10.11,14.56-17.61,22.32-8.23,8.52-17.34,16.87-23.72,23.2l-17.4,17.26L46.46,93.55C29.16,76.89,1,55.92,0,29.94-.63,11.74,13.73.08,30.25.29c14.76.2,21,7.54,30.58,16.89Z" />
    </svg>
  ),
  thumbsdown: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 122.88 106.16"
      className="ml-auto mr-auto mt-2 h-14 w-14"
      fill="currentColor"
    >
      <g>
        <path d="M4.03,61.56h27.36c2.21,0,4.02-1.81,4.02-4.02V4.03C35.41,1.81,33.6,0,31.39,0H4.03C1.81,0,0,1.81,0,4.03 v53.51C0,59.75,1.81,61.56,4.03,61.56L4.03,61.56z M63.06,101.7c2.12,10.75,19.72,0.85,20.88-16.48c0.35-5.3-0.2-11.47-1.5-18.36 l25.15,0c10.46-0.41,19.59-7.9,13.14-20.2c1.47-5.36,1.69-11.65-2.3-14.13c0.5-8.46-1.84-13.7-6.22-17.84 c-0.29-4.23-1.19-7.99-3.23-10.88c-3.38-4.77-6.12-3.63-11.44-3.63H55.07c-6.73,0-10.4,1.85-14.8,7.37v47.31 c12.66,3.42,19.39,20.74,22.79,32.11V101.7L63.06,101.7L63.06,101.7z" />
      </g>
    </svg>
  ),
  thumbsup: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 122.88 106.16"
      className="ml-auto mr-auto mb-3 h-14 w-14"
      fill="currentColor"
    >
      <g>
        <path d="M4.02,44.6h27.36c2.21,0,4.02,1.81,4.02,4.03v53.51c0,2.21-1.81,4.03-4.02,4.03H4.02 c-2.21,0-4.02-1.81-4.02-4.03V48.63C0,46.41,1.81,44.6,4.02,44.6L4.02,44.6z M63.06,4.46c2.12-10.75,19.72-0.85,20.88,16.48 c0.35,5.3-0.2,11.47-1.5,18.36l25.15,0c10.46,0.41,19.59,7.9,13.14,20.2c1.47,5.36,1.69,11.65-2.3,14.13 c0.5,8.46-1.84,13.7-6.22,17.84c-0.29,4.23-1.19,7.99-3.23,10.88c-3.38,4.77-6.12,3.63-11.44,3.63H55.07 c-6.73,0-10.4-1.85-14.8-7.37V51.31c12.66-3.42,19.39-20.74,22.79-32.11V4.46L63.06,4.46z" />
      </g>
    </svg>
  ),
  even: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0"
      y="0"
      className="ml-auto mr-auto mb-1 h-14 w-14"
      fill="currentColor"
    >
      <g>
        <line
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="undefined"
          strokeLinejoin="undefined"
          y2="45"
          x2="48"
          y1="45"
          x1="8"
          fill="none"
        />
        <ellipse ry="8" rx="8" id="svg_9" cy="19" cx="42" />
        <ellipse ry="8" rx="8" id="svg_9" cy="19" cx="15" />
      </g>
    </svg>
  ),
};

const ButtonContext = createContext();

export default function EmoticonButton({ children, checked, variant = "thumbsdown", ...rest }) {
  const svg = variants[variant] || variants.heart;
  const colors = checked
    ? "text-gray-100 border-gray-100 bg-holon-blue-500"
    : "text-holon-slated-blue-300 border-holon-slated-blue-300";

  return (
    <button
      {...rest}
      className={`aspect-square h-20 w-20 rounded-full border-2 transition hover:border-white hover:text-white focus:border-white focus:text-white ${colors}`}
    >
      {svg}
      <ButtonContext.Provider value={variant}>{children}</ButtonContext.Provider>
    </button>
  );
}

EmoticonButton.propTypes = {
  children: PropTypes.node,
  checked: PropTypes.bool,
  variant: PropTypes.oneOf(Object.keys(variants)),
};

/**
 * Hook which provides access to the button variant.
 */
export function useButtonContext() {
  const context = useContext(ButtonContext);

  if (!context) {
    throw new Error("useButtonContext must be used within a Button");
  }

  return context;
}
