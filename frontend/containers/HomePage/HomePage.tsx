import React from "react";

import PropTypes from "prop-types";
import { basePageWrap } from "../BasePage";
import Header from "../../components/Header/Header";
import s from "./HomePage.module.css";

const HomePage = ({ title }) => {
  return (
    <div className={s.Container}>
      <Header />
    </div>
  );
};

HomePage.defaultProps = {
  title: "",
};

HomePage.propTypes = {
  title: PropTypes.string.isRequired,
};

export default basePageWrap(HomePage);
