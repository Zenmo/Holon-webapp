import { InteractiveInputOptions } from "./InteractiveInputs";

export type Props = {
  contentId?: string;
  options: InteractiveInputOptions[];
  display?: string;
  defaultValue?: string | number | [];
  selectedLevel?: string;
  onChange: (id: string, value: number | string | boolean, optionId?: number) => void;
};

function InteractiveDropdown({ defaultValue, onChange, options, ...props }: Props) {
  return (
    <select
      className="bg-white border-2 border-holon-blue-900 text-sm rounded-lg focus:ring-holon-blue-100 focus:border-holon-blue-100 block p-2.5"
      defaultValue={defaultValue}
      onChange={e =>
        onChange(
          props.contentId,
          e.target.childNodes[e.target.selectedIndex].value,
          e.target.childNodes[e.target.selectedIndex].value
        )
      }>
      {options.map((inputItem: any, index: number) => {
        return (
          <option
            id={
              props.contentId +
              inputItem.id +
              (props.selectedLevel ? "holarchy" : "storyline") +
              "input"
            }
            key={inputItem.id + index}
            value={inputItem.id}>
            {inputItem.option}
          </option>
        );
      })}
    </select>
  );
}

export default InteractiveDropdown;
