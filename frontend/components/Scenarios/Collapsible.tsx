import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { ChevronUpIcon } from "@heroicons/react/outline";

type Props = React.PropsWithChildren<{
  label?: string;
}>;

export default function Collapsible({ children, label }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  function toggleSection() {
    setIsOpen(!isOpen);
  }

  return (
    <div className="container">
      <h4
        className={`toggle relative my-4 border-l-[0.75rem] border-b-2 border-holon-blue-900 pl-3 text-xl font-light `}
        onClick={toggleSection}
      >
        {label}
        <span className={`absolute right-0 h-4 w-4 text-black md:hidden`}>
          {isOpen ? <ChevronUpIcon></ChevronUpIcon> : <ChevronDownIcon></ChevronDownIcon>}
        </span>
      </h4>
      <div className={`${isOpen ? "flex" : "hidden"} mb-4 flex-col gap-4 md:flex`}>{children}</div>
    </div>
  );
}
