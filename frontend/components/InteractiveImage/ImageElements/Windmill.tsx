interface Props {
  top: string;
  left: string;
  width: string;
  dataTestId?: string;
}

export default function Windmill({ top, left, width, dataTestId }: Props) {
  return (
    <div
      className={`windmill absolute ${top} ${left} ${width}`}
      data-testid={dataTestId ? dataTestId : ""}
    >
      <img
        id="windmill-pole1"
        src="/imgs/flat_windmill_pole.png"
        className="windmillPole relative top-0 left-0"
        alt="windmill1"
      ></img>
      <img
        id="windmill-blades1"
        src="/imgs/flat_windmill_blades.png"
        className={`windmillBlades absolute top-[-40%] left-[0%]`}
        alt="windmill1"
      ></img>
    </div>
  );
}
