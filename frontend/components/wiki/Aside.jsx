import Link from "next/link";
import PropTypes from "prop-types";
import React from "react";

function Document({ item }) {
  const url =
    item.url.indexOf("index.mdx") > 0
      ? item.url.replace(/\index\.mdx$/, "")
      : item.url.replace(/\.mdx$/, "");
  const name = item.name.replace(/\.mdx$/, "");
  return (
    <Link href={"/wiki/" + url}>
      <span className={"block cursor-pointer bg-inherit px-4 pt-1 pb-3 "}>{name}</span>
    </Link>
  );
}
Document.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string,
    url: PropTypes.string,
  }),
};

function Folder({ item }) {
  return (
    <details open className="order-1 p-0 ">
      <summary className="text-md cursor-pointer bg-inherit py-3 px-4">
        <strong>{item.name}</strong>
      </summary>
      <div className="flex flex-col pl-4">
        {item.children.map((child, index) =>
          child.children.length < 1 ? (
            <Document key={index} item={child} />
          ) : (
            <Folder key={index} item={child} />
          )
        )}
      </div>
    </details>
  );
}
Folder.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string,
    children: PropTypes.any,
  }),
};

export default function Aside({ posts }) {
  return (
    <aside className=" sticky top-0 mx-3 mt-5">
      <div className="">
        {posts.map((item, index) =>
          item.children.length < 1 ? (
            <Document key={index} item={item} />
          ) : (
            <Folder key={index} item={item} />
          )
        )}
      </div>
    </aside>
  );
}

Aside.propTypes = {
  posts: PropTypes.any,
};
