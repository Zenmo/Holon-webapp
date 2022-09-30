type Props = React.PropsWithChildren<{
  tooltipMessage: string;
  result?: boolean;
}>;

export default function Tooltip({ tooltipMessage, result = false, children }: Props) {
  const visualRepresentation = result ? (
    <span className="absolute top-[-10px] right-[-5px] block h-4 w-4 rounded-full border-2 border-holon-blue-900 bg-white text-center text-xs font-bold leading-4 text-holon-blue-500 shadow-holon-blue-900 md:right-0 md:top-0">
      i
    </span>
  ) : (
    <span className="block h-[1.2rem] w-[1.2rem] rounded-full border-2 border-holon-blue-900 text-center font-bold leading-4 text-holon-blue-500 shadow-holon-blue-900">
      i
    </span>
  );

  return (
    <div className="group relative flex flex-col items-center">
      {children}
      {visualRepresentation}
      <div className="absolute bottom-full hidden min-w-[20rem] flex-col items-center group-hover:flex">
        <span className="relative z-50 rounded-md border-2 border-holon-blue-900 bg-white p-2 px-10 py-2 text-sm leading-none text-holon-blue-900 shadow-lg">
          {tooltipMessage}
        </span>
        <div className="-mt-2 h-3 w-3 rotate-45 bg-gray-600"></div>
      </div>
    </div>
  );
}
