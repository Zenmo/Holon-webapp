type StretchedLink = {
    content: React.ReactNode
    className: string
    linkProps: React.ComponentProps<"a">
}

export default function StretchedLink({ content, className, ...linkProps }: StretchedLink) {
    return (
        <a {...linkProps} className={`${className || ""} stretched-link`}>
            {content}
        </a>
    )
}
