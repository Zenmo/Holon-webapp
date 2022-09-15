import Link from "next/link";
import PropTypes from "prop-types";
import React from "react";

interface IBreadcrumbs {
  path: Array<string>;
  posts: IPostItem[];
}

interface IPostItem {
  name: string;
  url: string;
  children: IPostItem[];
}

interface IBreadcrumbItem {
  listItem: {
    name: string;
    url: string;
  };
}
function BreadcrumbItem({ listItem }: IBreadcrumbItem) {
  return (
    <li className="flex">
      {listItem.url.length ? (
        <Link href={"/wiki/" + listItem.url.replace(/\index.mdx$/, "").replace(/\.mdx$/, "")}>
          {listItem.name.replace(/\.mdx$/, "")}
        </Link>
      ) : (
        <span>{listItem.name.replace(/\.mdx$/, "")}</span>
      )}
    </li>
  );
}
BreadcrumbItem.propTypes = {
  listItem: PropTypes.shape({
    name: PropTypes.string,
    url: PropTypes.string,
  }),
};

function Breadcrumbs({ posts, path }: IBreadcrumbs) {
  const breadcrumbArray: IPostItem[] = [];

  function breadcrumbList(path: Array<string>, posts: IPostItem[], level: number): JSX.Element {
    const selectedItem = posts.find((child) => child.name.replace(/\.mdx$/, "") == path[level]);

    if (selectedItem) {
      // add item to the list, and go one level deeper
      breadcrumbArray.push(selectedItem);
      return breadcrumbList(path, selectedItem.children, level + 1);
    } else {
      //no more children, end of tree
      return (
        <>
          {breadcrumbArray.map((breadcrumbItem, index) => (
            <React.Fragment key={index}>
              <li className="">&#8250;</li>
              <BreadcrumbItem listItem={breadcrumbItem} />
            </React.Fragment>
          ))}
        </>
      );
    }
  }

  return (
    <nav className="flex flex-row justify-center py-2">
      <ul className="wiki-breadcrumbs container flex flex-row justify-start gap-3">
        <li>
          <Link href="/wiki/">Holon</Link>
        </li>
        {breadcrumbList(path, posts, 0)}
      </ul>
    </nav>
  );
}
export default Breadcrumbs;

Breadcrumbs.propTypes = {
  posts: PropTypes.array,
  path: PropTypes.string,
};
