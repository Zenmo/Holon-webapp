
import {ComponentProps, FunctionComponent} from "react";
import {ShareIcon} from "@heroicons/react/24/outline"

/**
 * Button that opens a large modal or fullscreen view.
 */
export const ShareButton: FunctionComponent<ComponentProps<"button">> = ({ ...props }) => (
    <button
        {...props}
        style={{
            display: "flex",
            alignItems: "center",
            gap: ".4rem",
            padding: "1rem",
            ...props.style,
            /* tailwind has already removed the browser default button styling */
    }}>
        <ShareIcon style={{
            height: "1.5rem",
        }} />
        Scenario delen
    </button>
)
