/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./containers/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "holon-gold-200": "#F3E7C5",
        "holon-gold-600": "#C89D28",
        "holon-blue-100": "#648FFF26",
        "holon-blue-200": "#648FFF40",
        "holon-blue-300": "#648FFF54",
        "holon-blue-500": "#23549F",
        "holon-blue-900": "#051E3F",
        "holon-gray-100": "#051E3F0D",
        "holon-gray-200": "#051E3F1A",
        "holon-gray-300": "#BFBFBF",
        "holon-slated-blue-300": "#AEC2E6",
        "holon-slated-blue-600": "#051E3FA6",
        "holon-slated-blue-900": "#051E3FBF",
        "holon-purple-100": "#F0EFFF",
        "holon-purple-200": "#785EF040",
        "holon-pink-100": "#DC267F26",
        "holon-pink-200": "#DC267F40",
        "holon-orange": "#FE6100",
        "holon-orange-100": "#FE610026",
        "holon-orange-200": "#FE610040",
        "holon-green": "#66b04f",
        "holon-light-green": "#DEF3DE",
        "holon-red": "#c51700",
        "holon-light-red": "#FFCCCC",
        "holon-holarchy-national": "#DAE5F5",
        "holon-holarchy-intermediate": "#B9CAE2",
        "holon-holarchy-local": "#9DB2CF",
      },
      backgroundImage: {
        "split-white-blue": "linear-gradient(-18deg, #051E3F 40% , white 30%)",
        "split-blue-white": "linear-gradient(-18deg, white 45%, #051E3F 40%)",
      },
      borderWidth: {
        8: "24px",
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
        golden: "inset 0 -25px 0px 0px #F3E7C5",
        blue: "inset 0 -25px 0px 0px #AEC2E6",
      },
      keyframes: {
        FadeIn: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "0.8" },
        },
      },
      animation: {
        cardFadeIn: "FadeIn 0.3s ease-in forwards",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/line-clamp")],
};
