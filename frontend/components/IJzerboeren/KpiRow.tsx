import {FunctionComponent, PropsWithChildren} from "react"

export const KpiRow: FunctionComponent<PropsWithChildren<{loading?: boolean}>> = ({loading = false, children}) => {
    const backgroundColor = loading ? "bg-holon-gray-400" : "bg-holon-slated-blue-900"

    return (
        <div className={`flex flex-row ${backgroundColor}`}>
            {children}
        </div>
    )
}
