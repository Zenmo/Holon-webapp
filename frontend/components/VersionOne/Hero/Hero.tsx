import React from "react";
import Image from "next/image";
import PropTypes from "prop-types";

import s from "./Hero.module.css";
import logo from "../../../public/img/logo.svg";

const Hero = ({ title }) => (
  <div className={s.Container}>
    <Image src={logo} width="100" height="100" className={s.Logo} />
    <h1 className={s.Title}>
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
