/* eslint-disable  @typescript-eslint/no-explicit-any */
interface Props {
  title: string;
  name: string;
  items: Array<string>;
  selectedItems: Array<string>;
  update: (params) => any;
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
      <h4 className="relative my-4 border-l-[0.75rem] border-b-2 border-holon-blue-900 pl-3 text-xl font-light">
        {title}
      </h4>
      {items &&
        items.sort().map((item, index) => {
          return (
            <label className="flex flex-row items-center gap-4" key={index}>
              <input
                className="flex h-5 w-5 appearance-none items-center justify-center rounded-none border-2 border-holon-blue-900 from-inherit bg-center py-2 text-white shadow-[4px_4px_0_0] shadow-black checked:bg-holon-blue-500 after:checked:content-['✔'] disabled:border-holon-grey-300 disabled:shadow-gray-500 disabled:checked:bg-holon-grey-300"
                type="checkbox"
                name={name}
                defaultChecked={selectedItems && selectedItems.includes(item)}
                value={item}
                onChange={() => {
                  update(item);
                }}></input>
              <span className="mr-auto">{item}</span>
            </label>
          );
        })}
    </div>
  );
}
