import { ReactNode } from "react";

function Tooltip({ tooltipMessage, children }) {

  return (
    <div className="relative flex flex-col items-center group">
      {children}
      <div className="absolute bottom-[100%] flex flex-col items-center hidden group-hover:flex">
        <span className="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-gray-600 shadow-lg rounded-md">{tooltipMessage}</span>
        <div className="w-3 h-3 -mt-2 rotate-45 bg-gray-600"></div>
      </div>
    </div>
  );
};
export default Tooltip;