interface Props {
  locked?: boolean;
  inputId: string;
  datatestid: string;
  value?: number;
  setValue: (value: number) => void;
  updateLayers: (value: string, setValue: (value: number) => void) => void;
  label?: string;
  step?: number;
  min?: number;
  max?: number;
  type?: string;
  tooltip?: boolean;
  unit?: string;
}

export default function ImageSlider({
  locked,
  inputId,
  datatestid,
  value,
  setValue,
  updateLayers,
  step,
  min,
  max,
  label,
  type,
  tooltip,
  unit,
}: Props) {
  return (
    <div className="my-4 flex flex-col">
      <label htmlFor={inputId} className="flex text-base">
        {label}
      </label>
      <div className={`flex flex-row ${tooltip && `pt-8`}`}>
        <div className="flex flex-row relative items-center flex-1 h-[24px]">
          <input
            data-testid={datatestid}
            defaultValue={value}
            disabled={locked}
            onChange={e => setValue(e.target.value)}
            className={`h-1 w-3/5 ${
              locked ? "cursor-not-allowed" : ""
            } slider interactImg appearance-none disabled:bg-holon-grey-300`}
            step={step}
            min={min}
            max={max}
            type={type}
          />
          {tooltip && (
            <div className="slidervalue">
              <div className="relative">
                <output
                  className="text-white border-white rounded"
                  style={{ left: "calc((" + value + " /" + max + ") * 100%)" }}>
                  {value}
                </output>
              </div>
            </div>
          )}
        </div>
        {unit && <span className="text-base ml-4">{unit}</span>}
      </div>
    </div>
  );
}
