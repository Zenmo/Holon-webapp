import Link from "next/link";
import React from "react";
import { useEffect, useState } from "react";

export default function Breadcrumbs(props) {
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  const breadcrumbarray = [];

  useEffect(() => {
    breadcrumb(props.posts, 1);
  }, [props.currentpage]);

  function breadcrumb(items, i) {
    const selectedPost = items.find((post) => post.name == props.currentpage.split("/")[i]);
    selectedPost
      ? (breadcrumbarray.push(selectedPost), breadcrumb(selectedPost.children, parseInt(i + 1)))
      : items.find((post) => post.name.replace(/\.mdx$/, "") == props.currentpage.split("/")[i])
      ? (breadcrumbarray.push(props.currentpage.split("/")[i]), setBreadcrumbs(breadcrumbarray))
      : setBreadcrumbs(breadcrumbarray);
  }
  return (
    <nav className="mb-8 flex flex-row justify-center bg-holon-gold-600 py-2">
      <ul className="container flex flex-row justify-start gap-3">
        <li>
          <Link href="/wiki/">Holon</Link>
        </li>
        {breadcrumbs.map((breadcrumbitem, index) => {
          const url = !breadcrumbitem.url
            ? ""
            : breadcrumbitem.url.indexOf("index.mdx") > 0
            ? breadcrumbitem.url.replace(/\index\.mdx$/, "")
            : breadcrumbitem.url.replace(/\.mdx$/, "");
          return (
            <li key={index}>
              {url ? (
                <Link href={"/wiki/" + url}>{breadcrumbitem.name}</Link>
              ) : (
                <span>{breadcrumbitem}</span>
              )}
            </li>
          );
        })}
        <li></li>
      </ul>
    </nav>
  );
}

Breadcrumbs.propTypes = {};
