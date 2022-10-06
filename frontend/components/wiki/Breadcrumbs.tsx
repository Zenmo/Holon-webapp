import Link from "next/link";
import React from "react";

interface Props {
  path: Array<string>;
  posts: PostItemProps[];
}

interface PostItemProps {
  name: string;
  url: string;
  children: PostItemProps[];
}

interface BreadcrumbItemProps {
  listItem: {
    name: string;
    url: string;
  };
}
function BreadcrumbItem({ listItem }: BreadcrumbItemProps) {
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

function Breadcrumbs({ posts, path }: Props) {
  const breadcrumbArray: PostItemProps[] = [];

  function breadcrumbList(path: Array<string>, posts: PostItemProps[], level: number): JSX.Element {
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
