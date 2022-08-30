import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Breadcrumbs(props) {
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  const breadcrumbArray = [];

  useEffect(() => {
    breadcrumb(props.posts, 1);
  }, [props.currentPage]);

  function breadcrumb(items, i) {
    const selectedPost = items.find((post) => post.name == props.currentPage.split("/")[i]);
    selectedPost
      ? (breadcrumbArray.push(selectedPost), breadcrumb(selectedPost.children, parseInt(i + 1)))
      : items.find((post) => post.name.replace(/\.mdx$/, "") == props.currentPage.split("/")[i])
      ? (breadcrumbArray.push(props.currentPage.split("/")[i]), setBreadcrumbs(breadcrumbArray))
      : setBreadcrumbs(breadcrumbArray);
  }
  return (
    <nav className="flex flex-row justify-center py-2">
      <ul className="container flex flex-row justify-start gap-3">
        <li>
          <Link href="/wiki/">Holon</Link>
        </li>
        {breadcrumbs.map((breadcrumbitem, index) => {
          const url = !breadcrumbitem.url
            ? ""
            : breadcrumbitem.url.indexOf("index.mdx") > 0
            ? " > " + breadcrumbitem.url.replace(/\index\.mdx$/, "")
            : breadcrumbitem.url.replace(/\.mdx$/, "");
          return (
            <li key={index}>
              {url ? (
                <Link href={"/wiki/" + url}>
                  <span>
                    <span className="mr-3 text-gray-600">{"/"}</span>
                    {breadcrumbitem.name}
                  </span>
                </Link>
              ) : (
                <span>
                  <span className="mr-3 text-gray-600">{"/"}</span>
                  <span className="font-bold text-holon-gold-600">{breadcrumbitem}</span>
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

Breadcrumbs.propTypes = {};
