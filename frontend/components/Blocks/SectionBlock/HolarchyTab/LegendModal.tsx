type LegendModal = {
  data: {
    colors: [
      {
        label: string;
        png: string;
      }
    ];
    lines: [
      {
        label: string;
        png: string;
      }
    ];
  };
};

export default function LegendModal({ data }: LegendModal) {
  return (
    <div className="flex flex-row justify-center animate-fallDown">
      <div
        role="figure"
        aria-label="Legend for colors and lines within image"
        className="px-4 py-2 w-[250px] h-[150px] bg-white flex flex-row justify-between">
        <div>
          <p>Type kleur</p>
          <ul>
            {data?.colors.map(color => {
              return (
                <li key={color.label} className="flex flex-row items-center">
                  <img className="object-contain h-4 w-4 mr-2" src={color.png}></img>
                  <p className="text-ellipsis overflow-hidden">{color.label}</p>
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <p>Type lijn</p>
          <ul>
            {data?.lines.map(line => {
              return (
                <li key={line.label} className="flex flex-row items-center">
                  <img className="object-contain h-4 w-4 mr-2" src={line.png}></img>
                  <p className="text-ellipsis overflow-hidden">{line.label}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
