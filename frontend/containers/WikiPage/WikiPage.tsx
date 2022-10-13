import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { basePageWrap } from "../BasePage";
import Aside from "@/components/Wiki/Aside";
import Article from "@/components/Wiki/Article";
import Breadcrumbs from "@/components/Wiki/Breadcrumbs";

interface WikiPageProps {
  title: string;
  relativeUrl: string;
  children: WikiPageProps[];
}

interface WikiContainerProps {
  richText: string;
  allPages: {
    items: WikiPageProps[];
    meta: { totalCount: number };
  };
}

const WikiPage = ({ richText, allPages }: WikiContainerProps) => {
  const router = useRouter();
  const { path } = router.query;

  const [wikiPostsHierarchy, setWikiPostsHierarchy] = useState<any[]>([]);
  const [pages, setPages] = useState<WikiPageProps[]>([]);

  const createWikiPostsHierarchy = (items: Array<WikiPageProps>) => {
    const urls = items;
    const tableDataNested = [];
    const prefixmap = new Map();
    for (const url of urls) {
      url.children = []; // extend node with the array
      const lastChar = url.relativeUrl.substr(-1);
      let address = url.relativeUrl;
      if (lastChar === "/") {
        address = url.relativeUrl.slice(0, -1);
      }
      const lastslash = address.lastIndexOf("/");
      const prefix = address.substring(0, lastslash);
      if (prefixmap.has(prefix)) {
        // has parent, so add to that one
        prefixmap.get(prefix).children.push(url);
      } else {
        // toplevel node
        tableDataNested.push(url);
      }
      prefixmap.set(address, url); // store as potential parent in any case
    }
    return tableDataNested;
  };

  useEffect(() => {
    setWikiPostsHierarchy(createWikiPostsHierarchy(allPages.items));
    setPages(allPages.items);
  }, [allPages]);

  return (
    <div className="flex min-h-screen min-w-full flex-col">
      <header className="flex h-[8vh] flex-row justify-start overflow-hidden bg-holon-blue-900 align-middle">
        <div className="flex w-3/12 justify-center justify-items-center">
          <a href="/wiki/" className="flex flex-row">
            Icon
            {/* <BookOpenIcon className="h-10 w-10 self-center text-white" /> */}
            <h1 className="ml-2 self-center py-2 text-3xl font-bold text-white">Holon Wiki</h1>
          </a>
        </div>
      </header>
      <div className="flex w-full flex-1 flex-row">
        <div className="flex w-3/12 flex-col border-r-2 border-gray-200">
          {pages && <Aside posts={wikiPostsHierarchy} />}
        </div>

        <main className="flex flex-1 flex-col">
          <div className="border-b-2 border-gray-200 py-3 pl-10">
            {allPages.items && <Breadcrumbs path={path} posts={pages} />}
          </div>
          <div className="p-3 flex flex-1 flex-row justify-between">
            <Article article={richText}></Article>
          </div>
        </main>
      </div>
    </div>
  );
};

export default basePageWrap(WikiPage);
