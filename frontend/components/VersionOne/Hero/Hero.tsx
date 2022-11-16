/* eslint-disable @next/next/no-img-element */

import React from "react";

import s from "./Hero.module.css";

const Hero = ({ title }: { title: string }) => (
  <div className={s.Container}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src="/img/logo.svg" width="100" height="100" className={s.Logo} alt="Holon" />
    <h1 className={s.Title}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={"/img/white_circle.png"} alt="Logo" className={s.TitleIcon} />
      {title}
    </h1>
  </div>
);

export default Hero;
