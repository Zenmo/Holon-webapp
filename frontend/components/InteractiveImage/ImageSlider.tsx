interface Props {
  locked?: boolean;
  inputId: string;
  datatestid: string;
  defaultValue?: number;
  setValue: (id: string, value: number) => void;
  label?: string;
  step?: number;
  min?: number;
  max?: number;
  type?: string;
}

export default function ImageSlider({
  locked,
  inputId,
  datatestid,
  defaultValue,
  setValue,
  step,
  min,
  max,
  label,
  type,
}: Props) {
  return (
    <div className="my-4 flex flex-row items-center justify-between gap-2">
      <label htmlFor={inputId} className="flex">
        {label}
      </label>
      <div className="flex flex-row items-center justify-between gap-2">
        <input
          data-testid={datatestid}
          disabled={locked}
          value={defaultValue}
          onChange={e => setValue(inputId, parseInt(e.target.value))}
          className={`h-1 w-3/5 ${
            locked ? "cursor-not-allowed" : ""
          } slider interactImg appearance-none disabled:bg-holon-grey-300`}
          step={step}
          min={min}
          max={max}
          type={type}
        />
      </div>
    </div>
  );
}
