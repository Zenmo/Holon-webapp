type Props = { label: string } & React.ComponentProps<"input">;

export default function InputElement({ label = "defaultLabel", ...inputProps }: Props) {
  return (
    <div className="flex flex-col">
      <label className="ml-1 font-bold italic">
        {`${label}`}
        <input
          className="mt-1 rounded-lg border-2 border-white bg-holon-blue-900 p-1 text-white placeholder:font-light placeholder:italic placeholder:text-holon-slated-blue-300 "
          type="text"
          {...inputProps}
        />
      </label>
    </div>
  );
}
