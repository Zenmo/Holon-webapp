import Link from "next/link";
import PropTypes from "prop-types";
import React from "react";

export default function Breadcrumbs(props) {
  const breadcrumbPath = props.currentPage.split("/");
  const breadcrumbarray = [];

  function BreadcrumbItem({ breadcrumbitem }) {
    return (
      <React.Fragment>
        <span className="">&#8250;</span>
        <li className="flex">
          <Link
            href={"/wiki/" + breadcrumbitem.url.replace(/\index.mdx$/, "").replace(/\.mdx$/, "")}
          >
            {breadcrumbitem.name.replace(/\.mdx$/, "")}
          </Link>
        </li>
      </React.Fragment>
    );
  }
  BreadcrumbItem.propTypes = {
    breadcrumbitem: PropTypes.shape({
      name: PropTypes.string,
      url: PropTypes.string,
    }),
  };

  function breadcrumblist(item, childs, index) {
    const breadcrumbitem = childs.find((child) => child.name.replace(/\.mdx$/, "") == item);
    if (breadcrumbitem) {
      // add item to the list, and go one level deeper
      breadcrumbarray.push(breadcrumbitem);
      return breadcrumblist(breadcrumbPath[index + 1], breadcrumbitem.children, index + 1);
    } else {
      //no more children, end of tree
      return breadcrumbarray.map((breadcrumbitem, index) => (
        <BreadcrumbItem breadcrumbitem={breadcrumbitem} key={index} />
      ));
    }
  }

  return (
    <nav className="flex flex-row justify-center py-2">
      <ul className="container flex flex-row justify-start gap-3">
        <li>
          <Link href="/wiki/">Holon</Link>
        </li>
        {breadcrumblist(breadcrumbPath[0], props.posts, 0)}
      </ul>
    </nav>
  );
}

Breadcrumbs.propTypes = {
  currentPage: PropTypes.string,
  posts: PropTypes.array,

  item: PropTypes.shape({
    name: PropTypes.string,
    url: PropTypes.string,
  }),
  childs: PropTypes.array,
};
