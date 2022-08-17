import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import Aside from "../components/wiki/aside";
import Breadcrumbs from "../components/wiki/breadcrumbs";
import { posts } from "../components/wiki/getAllPosts";

export default function DocsLayout({ children }) {
  const [currentpage, setCurrentpage] = useState("");

  useEffect(() => {
    // Client-side-only code
    setCurrentpage(window.location.pathname.slice(5, -1));
  });

  return (
    <React.Fragment>
      <div className="flex w-full flex-col">
        <header className="flex flex-row justify-center bg-holon-blue-900">
          <h1 className="container py-2 text-3xl font-bold text-white">Holon Wiki</h1>
        </header>
        {posts && currentpage && <Breadcrumbs currentpage={currentpage} posts={posts} />}

        <main className="flex flex-row justify-center">
          <div className="container flex flex-row gap-x-40">
            {posts && <Aside currentpage={currentpage} posts={posts} />}
            <article className="prose">{children}</article>
          </div>
        </main>
      </div>
    </React.Fragment>
  );
}

DocsLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
