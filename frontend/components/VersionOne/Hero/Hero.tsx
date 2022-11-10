/* eslint-disable @next/next/no-img-element */

import React from "react";
import Image from "next/image";
import PropTypes from "prop-types";

import s from "./Hero.module.css";
import logo from "../../../public/img/logo.svg";

const Hero = ({ title }) => (
  <div className={s.Container}>
    <Image src={logo} width="100" height="100" className={s.Logo} alt="Holon" />
    <h1 className={s.Title}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={"/img/white_circle.png"} alt="Logo" className={s.TitleIcon} />
      {title}
    </h1>
  </div>
);

Hero.propTypes = {
  title: PropTypes.string.isRequired,
};

Hero.defaultProps = {
  title: "",
};

export default Hero;
