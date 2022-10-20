import Link from "next/link";
import React from "react";

interface Props {
  posts: PostItemProps[];
}

interface PostItemProps {
  title: string;
  relativeUrl: string;
  children: PostItemProps[];
}

interface FolderItemProps {
  folderItem: {
    title: string;
    relativeUrl: string;
    children: PostItemProps[];
  };
}

interface DocumentItemProps {
  docItem: {
    title: string;
    relativeUrl: string;
  };
}

function Document({ docItem }: DocumentItemProps) {
  return (
    <Link href={docItem.relativeUrl}>
      <span className={"block cursor-pointer bg-inherit px-4 pt-1 pb-3 "}>{docItem.title}</span>
    </Link>
  );
}

function Folder({ folderItem }: FolderItemProps) {
  return (
    <details open className="order-1 p-0 ">
      <summary className="text-md cursor-pointer bg-inherit py-3 px-4">
        <Link href={folderItem.relativeUrl}>
          <strong>{folderItem.title}</strong>
        </Link>
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
    <aside className="sticky top-0 mx-3 mt-5">
      {posts &&
        posts.map((item, index) =>
          item.children.length < 1 ? (
            <Document key={index} docItem={item} />
          ) : (
            <Folder key={index} folderItem={item} />
          )
        )}
    </aside>
  );
}

export default Aside;
