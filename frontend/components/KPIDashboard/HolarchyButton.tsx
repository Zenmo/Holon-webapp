import Button from "@/components/Button/Button"
import { FunctionComponent } from "react"
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline"

export const HolarchyButton: FunctionComponent<
    { onClick: () => void; disabled?: boolean } & any
> = ({ onClick, disabled = false, ...rest }) => (
    <Button
        onClick={onClick}
        variant="light"
        disabled={disabled}
        className="px-5"
        css={{ display: "flex" }}
        {...rest}
    >
        <ArrowsPointingOutIcon
            style={{
                height: "1.5rem",
            }}
        />
        <span style={{ flexGrow: 1 }}>Holarchie</span>
    </Button>
)
