import {ArrowTopRightOnSquareIcon} from "@heroicons/react/24/outline";
import {ComponentProps, FunctionComponent} from "react";

/**
 * Button that opens a large modal or fullscreen view.
 */
export const EnlargeButton: FunctionComponent<ComponentProps<"button">> = ({ ...props }) => (
    <button
        {...props}
        style={{
            ...props.style,
            padding: "1rem",
            /* tailwind has already removed the browser default button styling */
    }}>
        <ArrowTopRightOnSquareIcon style={{
            height: "2rem",
        }} />
    </button>
)
