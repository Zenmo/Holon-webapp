import React from "react";
import Button from "./Button";
import data from "./Button.data";

function stories() {
  return {
    title: "Components/Button",
    component: Button,
  };
}

export default stories();

export const ButtonWithoutData = () => <Button />;
export const ButtonWithData = () => <Button {...data} />;
