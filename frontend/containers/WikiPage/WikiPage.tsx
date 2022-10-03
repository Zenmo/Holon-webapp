import { useEffect } from "react";
import React from "react";

// import i18n from '../../i18n';
// import PropTypes from 'prop-types';
import styles from "./WikiPage.module.css";

const WikiPage = ({ richText }) => {
  useEffect(() => {
    console.log("hello");
    console.log(richText);
  }, []);
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
          posts
          {/* {posts && <Aside posts={posts} />} */}
        </div>

        <main className="flex flex-1 flex-col">
          <div className="border-b-2 border-gray-200 py-3 pl-10">
            breadcrumb
            {/* {posts && <Breadcrumbs path={breadcrumbPath} posts={posts} />} */}
          </div>
          <div className="flex flex-1 flex-row justify-between">
            Article
            {/* <Article article={children}></Article> */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default WikiPage;
