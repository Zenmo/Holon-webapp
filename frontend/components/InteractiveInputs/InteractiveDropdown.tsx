import { InteractiveInputOptions } from "./InteractiveInputs"

export type Props = {
    contentId?: string
    options: InteractiveInputOptions[]
    display?: string
    defaultValue?: string | number | []
    selectedLevel?: string
    onChange: (id: string, value: number | string | boolean, optionId?: number) => void
}

function InteractiveDropdown({ defaultValue, onChange, options, ...props }: Props) {
    return (
        <select
            className="bg-white border-[1px] w-full border-holon-slated-blue-900 text-sm focus:ring-holon-slated-blue-300 focus:border-holon-slated-blue-300 block p-2.5"
            defaultValue={defaultValue}
            onChange={e =>
                onChange(
                    props.contentId,
                    e.target.childNodes[e.target.selectedIndex].value,
                    e.target.childNodes[e.target.selectedIndex].getAttribute("data-id"),
                )
            }
        >
            {options.map((inputItem, index: number) => {
                return (
                    <option
                        data-id={inputItem.id}
                        id={
                            props.contentId
                            + inputItem.id
                            + (props.selectedLevel ? "holarchy" : "storyline")
                            + "input"
                        }
                        key={inputItem.id + index}
                        className="p-4 m-4"
                        value={inputItem.option}
                    >
                        {inputItem.label ? inputItem.label : inputItem.option}
                    </option>
                )
            })}
        </select>
    )
}

export default InteractiveDropdown
