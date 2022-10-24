import { addParameters } from "@storybook/client-api";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";
import * as NextImage from "next/image";

import "../styles/index.css";

const customViewports = {
  gridSL: {
    name: "GRID - SL - Fluid",
    styles: {
      width: "500px",
      height: "950px",
    },
  },
  gridS: {
    name: "GRID - S - Fluid",
    styles: {
      width: "375px",
      height: "950px",
    },
  },
};

addParameters({
  viewport: { viewports: { ...customViewports, ...INITIAL_VIEWPORTS } },
});

const OriginalNextImage = NextImage.default;

Object.defineProperty(NextImage, "default", {
  configurable: true,
  value: props => <OriginalNextImage {...props} unoptimized loader={({ src }) => src} />,
});
