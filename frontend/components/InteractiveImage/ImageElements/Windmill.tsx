/* eslint-disable @next/next/no-img-element */
import styles from "../InteractiveImage.module.css"

interface Props {
    top?: string
    left?: string
    width?: string
}

export default function Windmill({ top, left, width }: Props) {
    return (
        <div className={`${styles.windmill} absolute`} style={{ top, left, width }}>
            <img
                src="/imgs/flat_windmill_pole.png"
                className={`${styles.windmillPole} relative top-0 left-0`}
                alt=""
            ></img>
            <img
                src="/imgs/flat_windmill_blades.png"
                className={`${styles.windmillBlades} absolute top-[-40%] left-[0%]`}
                alt=""
            ></img>
        </div>
    )
}
