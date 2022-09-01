import Link from "next/link";
import PropTypes from "prop-types";
import React from "react";
import { useRouter } from "next/router";

export default function Breadcrumbs(props) {
  const { pathname } = useRouter();
  const currentPage = pathname.slice(6);
  const breadcrumbPath = currentPage.split("/");

  const breadcrumbArray = [];

  function BreadcrumbItem({ listItem }) {
    return (
      <React.Fragment>
        <span className="">&#8250;</span>
        <li className="flex">
          <Link href={"/wiki/" + listItem.url.replace(/\index.mdx$/, "").replace(/\.mdx$/, "")}>
            {listItem.name.replace(/\.mdx$/, "")}
          </Link>
        </li>
      </React.Fragment>
    );
  }
  BreadcrumbItem.propTypes = {
    listItem: PropTypes.shape({
      name: PropTypes.string,
      url: PropTypes.string,
    }),
  };

  function breadcrumblist(item, childs, level) {
    const selectedItem = childs.find((child) => child.name.replace(/\.mdx$/, "") == item);
    if (selectedItem) {
      // add item to the list, and go one level deeper
      breadcrumbArray.push(selectedItem);
      return breadcrumblist(breadcrumbPath[level + 1], selectedItem.children, level + 1);
    } else {
      //no more children, end of tree
      return breadcrumbArray.map((breadcrumbItem, index) => (
        <BreadcrumbItem listItem={breadcrumbItem} key={index} />
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
  posts: PropTypes.array,

  item: PropTypes.shape({
    name: PropTypes.string,
    url: PropTypes.string,
  }),
  childs: PropTypes.array,
};
