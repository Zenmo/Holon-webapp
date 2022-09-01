import PropTypes from "prop-types";
import React from "react";
import { BookOpenIcon } from "@heroicons/react/solid";
import Aside from "../components/wiki/Aside";
import Breadcrumbs from "../components/wiki/Breadcrumbs";
import Article from "../components/wiki/Article";
import { posts } from "../components/wiki/getAllPosts";

export default function DocsLayout({ children }) {
  return (
    <React.Fragment>
      <div className="flex min-h-screen min-w-full flex-col">
        <header className="flex h-[8vh] flex-row justify-start overflow-hidden bg-holon-blue-900 align-middle">
          <div className="flex w-3/12 justify-center justify-items-center">
            <a href="/wiki/" className="flex flex-row">
              <BookOpenIcon className="h-10 w-10 self-center text-white" />
              <h1 className="ml-2 self-center py-2 text-3xl font-bold text-white">Holon Wiki</h1>
            </a>
          </div>
        </header>
        <div className="flex w-full flex-1 flex-row">
          <div className="flex w-3/12 flex-col border-r-2 border-gray-200">
            {posts && <Aside posts={posts} />}
          </div>

          <main className="flex flex-1 flex-col">
            <div className="border-b-2 border-gray-200 py-3 pl-10">
              {posts && <Breadcrumbs posts={posts} />}
            </div>
            <div className="flex flex-1 flex-row justify-between">
              <Article article={children}></Article>
            </div>
          </main>
        </div>
      </div>
    </React.Fragment>
  );
}

DocsLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
