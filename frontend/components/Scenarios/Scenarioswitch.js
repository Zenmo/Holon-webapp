import React from "react";
import PropTypes from "prop-types";
import Tooltip from "./Tooltip";

function ScenarioSwitch({
  disabled,
  neighbourhoodID,
  inputid,
  value,
  updatevalue,
  on,
  off,
  label,
  scenarioid,
  message,
}) {
  return (
    <div className="flex flex-row items-center justify-end gap-2">
      <label
        htmlFor={`scenario${inputid}switch${neighbourhoodID}${scenarioid}`}
        className="mr-auto cursor-pointer text-sm"
      >
        {label}
      </label>

      <label
        htmlFor={`scenario${inputid}switch${neighbourhoodID}${scenarioid}`}
        className="flex items-center gap-1"
      >
        <small>{off}</small>
        <span className={` relative mx-1 ${disabled && "cursor-not-allowed"}`}>
          <input
            disabled={disabled}
            type="checkbox"
            value=""
            id={`scenario${inputid}switch${neighbourhoodID}${scenarioid}`}
            className="peer sr-only"
            onChange={(e) => updatevalue(inputid, e.target.checked)}
            checked={value}
          />
          <div className={`bg-yellow h-[30px] w-16 rounded-sm border-2 border-holon-blue-900 0 p-1 text-holon-blue-900 shadow-[4px_4px_0_0] ${disabled ? "after:bg-holon-grey-300" : "after:bg-holon-blue-500"}  after:absolute after:top-[4px] after:left-[2px]  after:h-[1.3rem] after:w-5 after:rounded-sm after:border-2 after:border-holon-blue-900 after:shadow-[2px_2px_0_0] after:transition-all after:content-[''] peer-checked:after:left-[-2px] peer-checked:after:translate-x-[200%] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300`}></div>
        </span>
        <small>{on}</small>
      </label>
      <Tooltip tooltipMessage={message}></Tooltip>
    </div>
  );
}

export default ScenarioSwitch;

ScenarioSwitch.propTypes = {
  locked: PropTypes.bool,
  neighbourhoodID: PropTypes.string,
  inputid: PropTypes.string,
  value: PropTypes.bool,
  updatevalue: PropTypes.func,
  on: PropTypes.string,
  off: PropTypes.string,
  label: PropTypes.string,
  scenarioid: PropTypes.string,
  message: PropTypes.string,
};
