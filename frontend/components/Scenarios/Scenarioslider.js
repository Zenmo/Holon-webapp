import React from "react";
import PropTypes from "prop-types";
import Tooltip from "./Tooltip";

function ScenarioSlider({
  neighbourhoodID,
  locked,
  inputid,
  value,
  updatevalue,
  label,
  message,
  scenarioid,
}) {
  const sliderid = `scenarioslider${inputid}${neighbourhoodID}${scenarioid}`;
  return (
    <div className="mb-2 flex flex-row items-center justify-between gap-2">
      <label htmlFor={sliderid} className="flex">
        {label}
      </label>
      <div className="flex flex-row items-center justify-between gap-2">
        <input
          data-testid={sliderid}
          id={sliderid}
          type="range"
          onChange={(e) => updatevalue(inputid, e.target.value)}
          value={value}
          disabled={locked}
          className={`h-1 w-3/5 ${
            locked && "cursor-not-allowed "
          } slider appearance-none disabled:bg-holon-grey-300`}
          min="0"
          max="100"
        />
        <input
          data-testid="scenariosliderinput"
          aria-label={`${label} input`}
          disabled={locked}
          id={`${sliderid}number`}
          type="number"
          onChange={(e) => updatevalue(inputid, e.target.value)}
          value={value}
          className={`w-16 ${
            locked && "cursor-not-allowed"
          } rounded-sm border-2 border-holon-blue-900 bg-white p-1 text-right text-holon-blue-900 shadow-holon-blue placeholder:font-light placeholder:italic placeholder:text-holon-slated-blue-300 disabled:border-gray-500 disabled:text-slate-500 disabled:shadow-gray-500`}
          min="0"
          max="100"
        />
        <span>%</span>
        <Tooltip tooltipMessage={message}></Tooltip>
      </div>
    </div>
  );
}

export default ScenarioSlider;

ScenarioSlider.propTypes = {
  locked: PropTypes.bool,
  neighbourhoodID: PropTypes.string,
  inputid: PropTypes.string,
  value: PropTypes.number,
  updatevalue: PropTypes.func,
  on: PropTypes.string,
  off: PropTypes.string,
  label: PropTypes.string,
  scenarioid: PropTypes.string,
  message: PropTypes.string,
};
