import Link from "next/link"
import React, { CSSProperties } from "react"
import { usePathname } from "next/navigation"

interface Props {
    posts: PostItemProps[]
}

interface PostItemProps {
    title: string
    relativeUrl: string
    children: PostItemProps[]
}

interface FolderItemProps {
    folderItem: {
        title: string
        relativeUrl: string
        children: PostItemProps[]
    }
}

interface DocumentItemProps {
    docItem: {
        title: string
        relativeUrl: string
    }
}

function Document({ docItem }: DocumentItemProps) {
    const currentPath = usePathname()
    const style: CSSProperties = {}
    if (docItem.relativeUrl === currentPath) {
        style.backgroundColor = "lightblue"
    }
    return (
        <Link href={docItem.relativeUrl} legacyBehavior>
            <span className={"block cursor-pointer bg-inherit py-2 px-4"} style={style}>
                {docItem.title}
            </span>
        </Link>
    )
}

function Folder({ folderItem }: FolderItemProps) {
    const currentPath = usePathname()
    const style: CSSProperties = {}
    if (folderItem.relativeUrl === currentPath) {
        style.backgroundColor = "lightblue"
    }
    return (
        <details open className="order-1 p-0 ">
            <summary className="text-md cursor-pointer bg-inherit py-3 px-4" style={style}>
                <Link href={folderItem.relativeUrl} legacyBehavior>
                    <strong>{folderItem.title}</strong>
                </Link>
            </summary>
            <div className="flex flex-col pl-4">
                {folderItem.children.map((child, index) =>
                    child.children.length < 1 ?
                        <Document key={index} docItem={child} />
                    :   <Folder key={index} folderItem={child} />,
                )}
            </div>
        </details>
    )
}

function Aside({ posts }: Props) {
    return (
        <aside className="sticky top-0 mr-3 mt-5">
            {posts
                && posts.map((item, index) =>
                    item.children.length < 1 ?
                        <Document key={index} docItem={item} />
                    :   <Folder key={index} folderItem={item} />,
                )}
        </aside>
    )
}

export default Aside
