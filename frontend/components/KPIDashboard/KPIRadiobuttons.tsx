type RadioButtons = {
  updateValue: (value: string) => void;
  loading: boolean;
  dashboardId: string;
};

export default function KPIRadioButtons({ updateValue, loading, dashboardId }: RadioButtons) {
  return (
    <>
      <label htmlFor={`${dashboardId}-lokaal`} className="flex flex-row mb-2">
        <input
          defaultChecked={true}
          type="radio"
          name={`${dashboardId}-lokaal-nationaal`}
          value="local"
          id={`${dashboardId}-lokaal`}
          data-testid="radio-local"
          onChange={e => updateValue(e.target.value)}
          disabled={loading ? true : false}
          // checked={}
          className={`rounded-full after:checked:content-['●'] after:mt-[-2px] flex h-5 w-5 appearance-none items-center justify-center border-2 border-holon-blue-900 from-inherit bg-center py-2 text-white checked:bg-holon-blue-500 disabled:checked:bg-gray-500 disabled:border-gray-700`}
        />
        <span
          title="Deze setting toont de resultaten (KPI's) op het niveau van het lokale gebied dat op uurbasis wordt gesimuleerd. Het gedrag van de verschillende actoren wordt hiervoor opgeteld over het hele jaar."
          className="mr-auto ml-4">
          Lokale KPI&apos;s
        </span>
      </label>

      <label htmlFor={`${dashboardId}-regionaal`} className="flex flex-row mb-2">
        <input
          //defaultChecked={}
          type="radio"
          name={`${dashboardId}-lokaal-nationaal`}
          value="intermediate"
          id={`${dashboardId}-regionaal`}
          data-testid="radio-intermediate"
          onChange={e => updateValue(e.target.value)}
          disabled={loading ? true : false}
          // checked={}
          className={`rounded-full after:checked:content-['●'] after:mt-[-2px] flex h-5 w-5 appearance-none items-center justify-center border-2 border-holon-blue-900 from-inherit bg-center py-2 text-white checked:bg-holon-blue-500 disabled:checked:bg-gray-500 disabled:border-gray-700`}
        />
        <span
          title="De resultaten van het lokale gedrag worden opgeschaald naar een relevant tussenniveau zoals een gemeente of een provincie. Dit gebeurt middels het Energietransitiemodel (ETM). In de documentatie leest u meer over welke aannames zijn gedaan voor de opschaling naar regionale KPI's."
          className="mr-auto ml-4">
          Regionale KPI&apos;s
        </span>
      </label>

      <label htmlFor={`${dashboardId}-nationaal`} className="flex flex-row mb-2">
        <input
          //defaultChecked={}
          type="radio"
          name={`${dashboardId}-lokaal-nationaal`}
          value="national"
          id={`${dashboardId}-nationaal`}
          data-testid="radio-national"
          onChange={e => updateValue(e.target.value)}
          disabled={loading ? true : false}
          // checked={}
          className={`rounded-full after:checked:content-['●'] after:mt-[-2px] flex h-5 w-5 appearance-none items-center justify-center border-2 border-holon-blue-900 from-inherit bg-center py-2 text-white checked:bg-holon-blue-500 disabled:checked:bg-gray-500 disabled:border-gray-700`}
        />
        <span
          title="De resultaten van het lokale gedrag worden opgeschaald naar landelijk niveau middels het Energietransitiemodel (ETM). In de documentatie leest u meer over welke aannames zijn gedaan voor de opschaling naar nationale KPI's."
          className="mr-auto ml-4">
          Nationale KPI&apos;s
        </span>
      </label>
    </>
  );
}
