type RadioButtons = {
  updateValue: (value: string) => void;
  loading: boolean;
  dashboardId: string;
};

export default function KPIRadioButtons({ updateValue, loading, dashboardId }: RadioButtons) {
  return (
    <div className="flex flex-row ml-4">
      <label htmlFor="lokaal" className="flex flex-row mb-2">
        <input
          defaultChecked={true}
          type="radio"
          name={`${dashboardId}-lokaal-nationaal`}
          value="local"
          id={`lokaal`}
          data-testid="radio-local"
          onChange={e => updateValue(e.target.value)}
          disabled={loading ? true : false}
          // checked={}
          className={`rounded-full after:checked:content-['●'] after:mt-[-2px] flex h-5 w-5 appearance-none items-center justify-center border-2 border-holon-blue-900 from-inherit bg-center py-2 text-white checked:bg-holon-blue-500 disabled:checked:bg-gray-500 disabled:border-gray-700`}
        />
        <span className="mr-auto ml-4">Lokale KPI&apos;s</span>
      </label>

      <label htmlFor="nationaal" className="flex flex-row mb-2 ml-10 ">
        <input
          //defaultChecked={}
          type="radio"
          name={`${dashboardId}-lokaal-nationaal`}
          value="national"
          id={`nationaal`}
          data-testid="radio-national"
          onChange={e => updateValue(e.target.value)}
          disabled={loading ? true : false}
          // checked={}
          className={`rounded-full after:checked:content-['●'] after:mt-[-2px] flex h-5 w-5 appearance-none items-center justify-center border-2 border-holon-blue-900 from-inherit bg-center py-2 text-white checked:bg-holon-blue-500 disabled:checked:bg-gray-500 disabled:border-gray-700`}
        />
        <span className="mr-auto ml-4">Nationale KPI&apos;s</span>
      </label>
    </div>
  );
}
