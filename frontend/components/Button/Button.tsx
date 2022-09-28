import React from "react";

// import i18n from '../../i18n';
// import PropTypes from 'prop-types';
import styles from "./Button.module.css";

const Button = ({ onClick, text }) => (
  <button className={styles.Button} onClick={onClick}>
    {text}
  </button>
);

Button.propTypes = {};

Button.defaultProps = {};

export default Button;
