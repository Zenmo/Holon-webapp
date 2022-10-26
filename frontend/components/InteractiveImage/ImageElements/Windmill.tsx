import styles from "../InteractiveImage.module.css";

interface Props {
  top?: string;
  left?: string;
  width?: string;
  dataTestId?: string;
}

export default function Windmill({ top, left, width, dataTestId }: Props) {
  return (
    <div
      className={`${styles.windmill} absolute`}
      style={{ top, left, width }}
      data-testid={dataTestId ? dataTestId : ""}>
      <img
        id="windmills1"
        data-testid="windmills1"
        src="/imgs/flat_windmill_pole.png"
        className={`${styles.windmillPole} relative top-0 left-0`}
        alt=""></img>
      <img
        id="windmills2"
        data-testid="windmills2"
        src="/imgs/flat_windmill_blades.png"
        className={`${styles.windmillBlades} absolute top-[-40%] left-[0%]`}
        alt=""></img>
    </div>
  );
}
