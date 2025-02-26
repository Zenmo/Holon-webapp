/* eslint-disable  @typescript-eslint/no-explicit-any */
interface Props {
    title: string
    name: string
    items: [
        {
            name: string
            slug: string
        },
    ]
    selectedItems: Array<string>
    update: (params) => any
}

export default function StorylineOverviewFilter({
    title,
    name,
    items,
    selectedItems,
    update,
}: Props) {
    return (
        <div className="flex w-full flex-col gap-4 mb-5">
            <div className="mb-4 font-bold text-base">
                <p className="mb-4">{title}</p>
                {items
                    && items.map((item, index) => {
                        return (
                            <label className="flex flex-row mb-2 gap-4" key={index}>
                                <input
                                    className="rounded-none after:checked:content-['✔'] flex h-5 w-5 appearance-none items-center justify-center border-2 border-holon-blue-900 from-inherit bg-center py-2 text-white checked:bg-holon-blue-500"
                                    type="checkbox"
                                    name={name}
                                    defaultChecked={
                                        selectedItems && selectedItems.includes(item.name)
                                    }
                                    value={item.name}
                                    onChange={() => {
                                        update(item.name)
                                    }}
                                ></input>
                                <span className="mr-auto">{item.name}</span>
                            </label>
                        )
                    })}
            </div>
        </div>
    )
}
