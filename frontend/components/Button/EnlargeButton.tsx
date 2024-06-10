import {ArrowsPointingOutIcon} from "@heroicons/react/24/outline";
import {ComponentProps, FunctionComponent} from "react";

/**
 * Button that opens a large modal or fullscreen view.
 */
export const EnlargeButton: FunctionComponent<ComponentProps<"button">> = ({ ...props }) => (
    <button
        {...props}
        style={{
            display: "flex",
            alignItems: "center",
            gap: ".2rem",
            padding: "1rem",
            ...props.style,
            /* tailwind has already removed the browser default button styling */
    }}>
        Holarchie
        <ArrowsPointingOutIcon style={{
            height: "2rem",
        }} />
    </button>
)
