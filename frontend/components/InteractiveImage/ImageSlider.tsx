interface Props {
  locked?: boolean;
  inputId: string;
  value: number;
  updateLayers: (value: string) => void;
  label: string;
  step: number;
  min: number;
  max: number;
  type: string;
}

export default function ImageSlider({
  locked,
  inputId,
  value,
  updateLayers,
  step,
  min,
  max,
  label,
  type,
}: Props) {
  return (
    <div className="mb-2 flex flex-row items-center justify-between gap-2">
      <label htmlFor={inputId} className="flex">
        {label}
      </label>
      <div className="flex flex-row items-center justify-between gap-2">
        <input
          data-testid="1test"
          id="zonnepanelen_test"
          value={value}
          disabled={locked}
          onChange={(e) => updateLayers(e.target.value)}
          className={`h-1 w-3/5 ${
            locked ? "cursor-not-allowed" : ""
          } slider appearance-none disabled:bg-holon-grey-300`}
          step={step}
          min={min}
          max={max}
          type={type}
        />
      </div>
    </div>
  );
}
