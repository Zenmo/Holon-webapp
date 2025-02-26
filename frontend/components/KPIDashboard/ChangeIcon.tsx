import { FunctionComponent } from "react"

export enum ChangeDirection {
    MORE = "MORE",
    LESS = "LESS",
    SAME = "SAME",
}

export enum ChangeAppreciation {
    MORE_IS_BETTER = "MORE_IS_BETTER",
    MORE_IS_WORSE = "MORE_IS_WORSE",
}

const icons = {
    [ChangeDirection.MORE]: "↑",
    [ChangeDirection.LESS]: "↓",
    [ChangeDirection.SAME]: "",
}

enum Appreciation {
    BETTER = "BETTER",
    WORSE = "WORSE",
    SAME = "SAME",
}

const colors = {
    [Appreciation.BETTER]: "lightgreen",
    [Appreciation.WORSE]: "red",
    [Appreciation.SAME]: "white",
}

function getAppreciation(
    changeDirection: ChangeDirection,
    changeAppreciation: ChangeAppreciation,
): Appreciation {
    if (changeDirection === ChangeDirection.MORE) {
        return changeAppreciation === ChangeAppreciation.MORE_IS_BETTER ?
                Appreciation.BETTER
            :   Appreciation.WORSE
    }

    if (changeDirection === ChangeDirection.LESS) {
        return changeAppreciation === ChangeAppreciation.MORE_IS_BETTER ?
                Appreciation.WORSE
            :   Appreciation.BETTER
    }

    return Appreciation.SAME
}

export function calcChangeDirection(
    previous: Nullable<number>,
    current: Nullable<number>,
): ChangeDirection {
    if (
        typeof previous !== "number"
        || typeof current !== "number"
        || Number.isNaN(previous)
        || Number.isNaN(current)
    ) {
        return ChangeDirection.SAME
    }

    if (current > previous) {
        return ChangeDirection.MORE
    }

    if (current < previous) {
        return ChangeDirection.LESS
    }

    return ChangeDirection.SAME
}

export const ChangeIcon: FunctionComponent<{
    changeDirection: ChangeDirection
    changeAppreciation: ChangeAppreciation
    style?: React.CSSProperties
}> = ({ changeDirection, changeAppreciation, style = {} }) => (
    <span
        style={{
            color: colors[getAppreciation(changeDirection, changeAppreciation)],
            fontSize: "2rem",
            fontWeight: "bold",
            ...style,
        }}
    >
        {icons[changeDirection]}
    </span>
)
