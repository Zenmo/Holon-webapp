import React from "react";

// import i18n from '../../i18n';
// import PropTypes from 'prop-types';
import styles from "./StorylinePage.module.css";

const StorylinePage = props => {
  console.log(props);
  return <div className={styles["StorylinePage"]}>StorylinePage!</div>;
};

StorylinePage.propTypes = {};

StorylinePage.defaultProps = {};

export default StorylinePage;
