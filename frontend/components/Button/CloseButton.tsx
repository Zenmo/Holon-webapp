import { ComponentProps, FunctionComponent } from "react"
import { XMarkIcon } from "@heroicons/react/24/outline"

/**
 * "X" button that closes a modal or fullscreen view.
 * Typically shown in the top right.
 *
 * Tailwind has already removed the browser default button styling
 */
export const CloseButton: FunctionComponent<ComponentProps<"button">> = ({ ...props }) => (
    <button
        aria-label="Sluiten"
        type="button"
        {...props}
        style={{
            height: "1.66rem",
            ...props.style,
        }}
        className={`text-holon-blue-900 ${props.className}`}
    >
        <XMarkIcon
            style={{
                height: "100%",
            }}
        />
    </button>
)
