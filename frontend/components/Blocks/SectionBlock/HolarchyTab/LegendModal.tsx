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

function LegendModalItems({legendItems}: Array<LegendItem>) {
    return legendItems.map((legendItem: LegendItem) => (
        <li key={legendItem.label} className="flex flex-row items-center" title={legendItem.label}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                width="16"
                height="16"
                alt=""
                className="object-cover"
                src={legendItem.imageSelector.img.src}
            />
            <span className="ml-1">{legendItem.label}</span>
        </li>
    ))
}

export default function LegendModal({data}: LegendModal) {
    return (
        <>
            <h3>Legenda</h3>
            <br/>
            <div
                role="figure"
                aria-label="Legend for colors and lines within image"
                className="gap-4 py-2 min-w-[350px] h-auto flex flex-row justify-around">
                <div>
                    <p>Type kleur</p>

                    {data["color"] && (
                        <ul>
                            <LegendModalItems legendItems={data["color"]}/>
                        </ul>
                    )}
                </div>
                <div>
                    <p>Type lijn</p>

                    {data["line"] && (
                        <ul>
                            <LegendModalItems legendItems={data["line"]}/>
                        </ul>
                    )}
                </div>
            </div>
        </>
    )
}
