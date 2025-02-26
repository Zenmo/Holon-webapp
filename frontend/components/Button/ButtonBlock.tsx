import Button from "@/components/Button/Button"

type Props = {
    buttons: Array<Button>
    align: string
}

type Button = {
    type: string
    value: {
        buttonStyle: "dark" | "light" | undefined
        buttonText: string
        buttonLink: [
            {
                type: "intern" | "extern"
                value: number | string
                id: string
            },
        ]
    }
    id: string
}

export default function ButtonBlock({ buttons, align }: Props) {
    const alignValue = (align: string) => {
        switch (align) {
            case "btn-left":
                return "justify-start"
                break
            case "btn-center":
                return "justify-center"
                break
            case "btn-right":
                return "justify-end"
                break
            default:
                return "justify-start"
        }
    }

    return (
        <div
            className={`flex flex-row w-full ${alignValue(
                align,
            )} h-fit px-10 lg:px-16 lg:pb-4 flex-wrap gap-4`}
        >
            {buttons.map((button, index) => {
                return (
                    <Button
                        tag="a"
                        details={button.value}
                        variant={button.value.buttonStyle}
                        key={index}
                    >
                        {button.value.buttonText}
                    </Button>
                )
            })}
        </div>
    )
}
