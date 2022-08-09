import PropTypes from "prop-types";

export default function DocsLayout({ children }) {
  return <div className="prose p-12">{children}</div>;
}

DocsLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
