import PropTypes from "prop-types";
function Tooltip({ tooltipMessage, result = false, children }) {
  const visualRepresentation = result ? (
    <span className="absolute right-0 top-0 block h-[1rem] w-[1rem] rounded-full border-2 border-holon-blue-900 bg-white text-center text-xs font-bold leading-[1rem] text-holon-blue-500 shadow-holon-blue-900">
      i
    </span>
  ) : (
    <span className="block h-[1.2rem] w-[1.2rem] rounded-full border-2 border-holon-blue-900 text-center font-bold leading-[1rem] text-holon-blue-500 shadow-holon-blue-900">
      i
    </span>
  );

  return (
    <div className="group relative flex flex-col items-center">
      {children}
      {visualRepresentation}
      <div className="absolute bottom-[100%] flex hidden min-w-[20rem] flex-col items-center group-hover:flex">
        <span className="relative z-50 rounded-md border-2 border-holon-blue-900 bg-white p-2 px-10 py-2 text-sm leading-none text-holon-blue-900 shadow-lg">
          {tooltipMessage}
        </span>
        <div className="-mt-2 h-3 w-3 rotate-45 bg-gray-600"></div>
      </div>
    </div>
  );
}
export default Tooltip;

Tooltip.propTypes = {
  tooltipMessage: PropTypes.string,
  result: PropTypes.bool,

  children: PropTypes.object,
};
