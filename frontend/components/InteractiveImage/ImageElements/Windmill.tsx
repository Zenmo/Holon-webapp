interface Props {
  top: string;
  left: string;
  width: string;
  dataTestId?: string;
}

export default function Windmill({ top, left, width, dataTestId }: Props) {
  return (
    <div
      className={`windmill absolute`}
      style={{ top, left, width }}
      data-testid={dataTestId ? dataTestId : ""}
    >
      <img
        src="/imgs/flat_windmill_pole.png"
        className="windmillPole relative top-0 left-0"
        alt=""
      ></img>
      <img
        src="/imgs/flat_windmill_blades.png"
        className={`windmillBlades absolute top-[-40%] left-[0%]`}
        alt=""
      ></img>
    </div>
  );
}
