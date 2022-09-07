import Tooltip from "./Tooltip";

interface Props {
  inputId: string;
  label: string;
  locked?: boolean;
  message: string;
  neighbourhoodID?: string;
  off: string;
  on: string;
  scenarioId: string;
  updateValue: (id: string, checked: boolean) => void;
  value: boolean;
}

export default function ScenarioSwitch({
  locked,
  neighbourhoodID,
  inputId,
  value,
  updateValue,
  on,
  off,
  label,
  scenarioId,
  message,
}: Props) {
  const switchid = neighbourhoodID
    ? `scenarioswitch${inputId}${neighbourhoodID}${scenarioId}`
    : `scenarioswitch${inputId}${scenarioId}`;
  return (
    <div className="flex flex-row items-center justify-end gap-2">
      <label htmlFor={switchid} className="mr-auto cursor-pointer text-sm">
        {label}
      </label>

      <label htmlFor={switchid} className="flex items-center gap-1">
        <small>{off}</small>
        <span className={` relative mx-1 ${locked ? "cursor-not-allowed" : ""}`}>
          <input
            data-testid={switchid}
            disabled={locked}
            type="checkbox"
            value=""
            id={switchid}
            className="peer sr-only"
            onChange={(e) => updateValue(inputId, e.target.checked)}
            checked={value}
          />
          <div
            className={`h-3.5 w-8 rounded-sm border-2 p-1 shadow-[4px_4px_0_0] sm:h-[30px] sm:w-16 ${
              locked
                ? "border-gray-500 text-slate-500 shadow-gray-500 after:border-gray-500 after:bg-holon-grey-300"
                : "border-holon-blue-900 text-holon-blue-900 after:border-holon-blue-900 after:bg-holon-blue-500 "
            }  after:absolute after:top-[2px] after:left-[2px] after:h-[0.6rem] after:w-[0.6rem] after:rounded-sm after:border-2  after:shadow-[2px_2px_0_0] after:transition-all after:content-[''] peer-checked:after:left-[-1px] peer-checked:after:translate-x-[200%] peer-focus:outline-none peer-focus:ring-4  peer-focus:ring-blue-300 sm:after:top-[4px]  sm:after:left-[2px] sm:after:h-[1.3rem] sm:after:w-5`}
          ></div>
        </span>
        <small>{on}</small>
      </label>
      <Tooltip tooltipMessage={message}></Tooltip>
    </div>
  );
}
