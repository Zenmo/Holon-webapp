import {FunctionComponent, useEffect, useState} from "react";
import styles from "./Step.module.css";

export type StepProps = {
    id: string,
    num: number,
    title: string,
}

export const Step: FunctionComponent<StepProps> = ({id, num, title}) => {
    const [active, setActive] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const target = document.getElementById(id)
            if (!target) {
                console.error(`Target with id ${id} not in DOM`)
                return
            }
            const rect = target.parentElement.getBoundingClientRect()
            const visibleTop = Math.max(0, rect.top);
            const visibleBottom = Math.min(window.visualViewport.height, rect.bottom);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);

            if (visibleHeight > (window.visualViewport.height / 2)) {
                setActive(true)
            } else {
                 setActive(false)
            }
        }
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
         <a href={`#${id}`} style={{
             textAlign: "center",
             display: "flex",
             flexDirection: "column",
             alignItems: "center",
         }} className={styles.Step}>
              <div
                  className={`${styles.StepNumber} ${active && styles.active} bg-white border-holon-blue-900 border-2 rounded`}
                  style={{
                      padding: "0.2rem 2rem",
                      fontSize: "1.2rem",
                      fontWeight: "bold",
              }}>
                  {num}
              </div>
              <div>{title}</div>
         </a>
    )
}
