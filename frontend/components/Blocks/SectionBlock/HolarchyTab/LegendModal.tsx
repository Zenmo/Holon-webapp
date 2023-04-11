import Image from "next/image";

export type LegendItem = {
  label: string;
  imageSelector: {
    img: {
      src: string;
    };
  };
};

type LegendModal = {
  data: {
    color: LegendItem[];
    line: LegendItem[];
  };
};

export default function LegendModal({ data }: LegendModal) {
  return (
    <div className="flex flex-row justify-center animate-fallDown">
      <div
        role="figure"
        aria-label="Legend for colors and lines within image"
        className="px-4 py-2 min-w-[350px] h-auto bg-white flex flex-row justify-between z-50">
        <div>
          <p>Type kleur</p>

          {data["color"] && (
            <ul>
              {data["color"].map(cl => {
                return (
                  <li key={cl.label} className="flex flex-row items-center">
                    <Image
                      width="20"
                      height="20"
                      alt=""
                      className="object-contain"
                      src={cl.imageSelector.img.src}
                    />
                    <p className="ml-1 text-ellipsis overflow-hidden">{cl.label}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div>
          <p>Type lijn</p>

          {data["line"] && (
            <ul>
              {data["line"].map(ln => {
                return (
                  <li key={ln.label} className="flex flex-row items-center">
                    <Image
                      width="16"
                      height="16"
                      alt=""
                      className="object-contain"
                      src={ln.imageSelector.img.src}
                    />
                    <p className="ml-1 text-ellipsis overflow-hidden">{ln.label}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
