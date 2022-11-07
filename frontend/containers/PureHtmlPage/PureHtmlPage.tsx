import React from "react";
import PropTypes from "prop-types";

const PureHtmlPage = ({ html }: { html: string }) => (
  <div dangerouslySetInnerHTML={{ __html: html }} />
);

export default PureHtmlPage;
