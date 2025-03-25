import dynamic from "next/dynamic"

// Importing like this prevents an issue with server-side rendering
export const IronPowderSankey = dynamic(
    () => import('../Sankey/Sankey').then(res => res.IronPowderSankey),
    { ssr: false }
)
