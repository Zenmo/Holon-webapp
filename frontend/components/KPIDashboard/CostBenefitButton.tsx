import Button from "@/components/Button/Button"
import { FunctionComponent } from "react"

export const CostBenefitButton: FunctionComponent<
    {
        onClick: () => void
        disabled?: boolean
    } & any
> = ({ onClick, disabled = false, ...rest }) => (
    <Button onClick={onClick} variant="light" disabled={disabled} className="px-5" {...rest}>
        <span
            css={{
                fontWeight: "bold",
                fontSize: "1.5em",
                paddingLeft: ".25em",
                paddingRight: ".5em",
            }}
        >
            &euro;
        </span>
        Kosten en Baten
    </Button>
)
