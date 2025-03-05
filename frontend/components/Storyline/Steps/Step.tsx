import { FunctionComponent } from "react"
import styles from "./Step.module.css"

export type StepData = {
    id: string
    title: string
    index: number
    active: boolean
}

export const Step: FunctionComponent<StepData> = ({ id, index, title, active }) => {
    return (
        <a
            href={`#${id}`}
            style={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
            className={styles.Step}
        >
            <div
                className={`${styles.StepNumber} ${active && styles.active} bg-white border-holon-blue-900 border-2 rounded`}
                style={{
                    padding: "0.2rem 2rem",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                }}
            >
                {index + 1}
            </div>
            <div>{title}</div>
        </a>
    )
}
