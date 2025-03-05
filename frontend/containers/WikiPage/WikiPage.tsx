import React, { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { basePageWrap } from "../BasePage"
import Aside from "@/components/Wiki/Aside"
import Article from "@/components/Wiki/Article"
import Breadcrumbs from "@/components/Wiki/Breadcrumbs"
import { PageProps, TextAndMediaVariant, TitleBlockVariant, CardBlockVariant } from "../types"

interface WikiPageProps {
    title: string
    relativeUrl: string
    children: WikiPageProps[]
}

type Content = PageProps<TextAndMediaVariant | TitleBlockVariant | CardBlockVariant>

interface WikiContainerProps {
    content: Content
    wikiMenu: {
        items: WikiPageProps[]
        meta: { totalCount: number }
    }
}

const WikiPage = ({ content, wikiMenu }: WikiContainerProps) => {
    const router = useRouter()
    const { path } = router.query

    const [wikiPostsHierarchy, setWikiPostsHierarchy] = useState<WikiPageProps[]>([])
    const [pages, setPages] = useState<WikiPageProps[]>([])

    const createWikiPostsHierarchy = (items: Array<WikiPageProps>) => {
        const urls = items
        const tableDataNested = []
        const prefixmap = new Map()
        for (const url of urls) {
            url.children = [] // extend node with the array
            const lastChar = url.relativeUrl.slice(-1)
            let address = url.relativeUrl
            if (lastChar === "/") {
                address = url.relativeUrl.slice(0, -1)
            }
            const lastslash = address.lastIndexOf("/")
            const prefix = address.substring(0, lastslash)
            if (prefixmap.has(prefix)) {
                // has parent, so add to that one
                prefixmap.get(prefix).children.push(url)
            } else {
                // toplevel node
                tableDataNested.push(url)
            }
            prefixmap.set(address, url) // store as potential parent in any case
        }
        return tableDataNested
    }

    useEffect(() => {
        setWikiPostsHierarchy(
            createWikiPostsHierarchy(wikiMenu?.items.length > 0 ? wikiMenu.items : []),
        )
        setPages(wikiMenu?.items.length > 0 ? wikiMenu.items : [])
    }, [wikiMenu])

    return (
        <div className="flex min-h-screen flex-col  holonContentContainer px-10 lg:px-16">
            <div className="flex w-full flex-1 flex-row">
                <div className="flex w-3/12 flex-col border-r-2 border-gray-200">
                    {pages && <Aside posts={wikiPostsHierarchy} />}
                </div>

                <main className="flex flex-1 flex-col">
                    <div className="border-b-2 border-gray-200 py-3 pl-10">
                        {pages && <Breadcrumbs path={path ? [path].flat() : []} posts={pages} />}
                    </div>
                    <div className="p-3 flex flex-1 flex-row justify-between">
                        <Article article={content}></Article>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default basePageWrap(WikiPage)
