import React from "react";
import Hero from "./Hero";
import data from "./Hero.data";

function stories() {
  return {
    title: "Components/Hero",
    component: Hero,
  };
}

export default stories;

export const HeroWithoutData = () => <Hero />;
export const HeroWithData = () => <Hero {...data} />;
