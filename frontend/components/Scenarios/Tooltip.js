function Tooltip({ tooltipMessage, children }) {
  return (
    <div className="group relative flex flex-col items-center">
      {children}
      <div className="absolute bottom-[100%] flex hidden min-w-[12rem] flex-col items-center group-hover:flex">
        <span className="whitespace-no-wrap relative z-10 rounded-md bg-gray-600 p-2 text-xs leading-none text-white shadow-lg">
          {tooltipMessage}
        </span>
        <div className="-mt-2 h-3 w-3 rotate-45 bg-gray-600"></div>
      </div>
    </div>
  );
}
export default Tooltip;
