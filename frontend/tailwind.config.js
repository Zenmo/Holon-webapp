/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "holon-gold-200": "#F3E7C5",
        "holon-gold-600": "#C89D28",
        "holon-blue-200": "#C6D8F2",
        "holon-blue-500": "#23549F",
        "holon-blue-900": "#051E3F",
        "holon-grey-300": "#BFBFBF",
        "holon-slated-blue-300": "#AEC2E6",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      translate: {
        "holon-bh-x": "0.2rem", // holon-bh :: holon-button-hover
        "holon-bh-y": "0.1rem",
      },
      boxShadow: {
        "holon-white": "0.3rem 0.15rem white",
        "holon-white-hover": "0.1rem 0.05rem white",
        "holon-blue": "0.3rem 0.15rem #051E3F",
        "holon-blue-hover": "0.1rem 0.05rem #051E3F",
      },
    },
  },
  plugins: [],
};
