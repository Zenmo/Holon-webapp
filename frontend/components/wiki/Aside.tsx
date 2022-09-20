import Link from "next/link";
import React from "react";

interface Props {
  posts: PostItemProps[];
}

interface PostItemProps {
  name: string;
  url: string;
  children: PostItemProps[];
}

interface FolderItemProps {
  folderItem: {
    name: string;
    children: PostItemProps[];
  };
}

interface DocumentItemProps {
  docItem: {
    name: string;
    url: string;
  };
}

function Document({ docItem }: DocumentItemProps) {
  const url =
    docItem.url.indexOf("index.mdx") > 0
      ? docItem.url.replace(/\index\.mdx$/, "")
      : docItem.url.replace(/\.mdx$/, "");
  const name = docItem.name.replace(/\.mdx$/, "");
  return (
    <Link href={"/wiki/" + url}>
      <span className={"block cursor-pointer bg-inherit px-4 pt-1 pb-3 "}>{name}</span>
    </Link>
  );
}

function Folder({ folderItem }: FolderItemProps) {
  return (
    <details open className="order-1 p-0 ">
      <summary className="text-md cursor-pointer bg-inherit py-3 px-4">
        <strong>{folderItem.name}</strong>
      </summary>
      <div className="flex flex-col pl-4">
        {folderItem.children.map((child, index) =>
          child.children.length < 1 ? (
            <Document key={index} docItem={child} />
          ) : (
            <Folder key={index} folderItem={child} />
          )
        )}
      </div>
    </details>
  );
}

function Aside({ posts }: Props) {
  return (
    <aside className=" sticky top-0 mx-3 mt-5">
      <div className="">
        {posts &&
          posts.map((item, index) =>
            item.children.length < 1 ? (
              <Document key={index} docItem={item} />
            ) : (
              <Folder key={index} folderItem={item} />
            )
          )}
      </div>
    </aside>
  );
}

export default Aside;
