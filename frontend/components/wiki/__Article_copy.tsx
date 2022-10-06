import { MDXProvider } from "@mdx-js/react";
import Head from "next/head";
import RawHtml from "../RawHtml";

const toSlug = (str: string) => {
  return str
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

interface MDXItemProps {
  children: string;
}

const articleComponents: Record<string, (p: MDXItemProps) => React.ReactElement> = {
  h1: (props: MDXItemProps) => <h1 id={toSlug(props.children)} {...props} />,
  h2: (props: MDXItemProps) => <h2 id={toSlug(props.children)} {...props} />,
  h3: (props: MDXItemProps) => <h3 id={toSlug(props.children)} {...props} />,
  h4: (props: MDXItemProps) => <h4 id={toSlug(props.children)} {...props} />,
  h5: (props: MDXItemProps) => <h5 id={toSlug(props.children)} {...props} />,
  h6: (props: MDXItemProps) => <h6 id={toSlug(props.children)} {...props} />,
};

const sideComponents: Record<string, (p: MDXItemProps) => React.ReactElement | null> = {
  h1: (props: MDXItemProps) =>
    typeof typeof props.children === "string" ? (
      <a
        className="wiki-context-menu-link px-4 pt-1 pb-3"
        href={`#${toSlug(props.children)}`}
        {...props}
      />
    ) : (
      <></>
    ),
  h2: (props: MDXItemProps) =>
    typeof props.children === "string" ? (
      <a
        className="wiki-context-menu-link px-4 pt-1 pb-3"
        href={`#${toSlug(props.children)}`}
        {...props}
      />
    ) : null,
  h3: (props: MDXItemProps) =>
    typeof props.children === "string" ? (
      <a
        className="wiki-context-menu-link px-4 pt-1 pb-3"
        href={`#${toSlug(props.children)}`}
        {...props}
      />
    ) : null,
  h4: (props: MDXItemProps) =>
    typeof props.children === "string" ? (
      <a
        className="wiki-context-menu-link px-4 pt-1 pb-3"
        href={`#${toSlug(props.children)}`}
        {...props}
      />
    ) : null,
  h5: (props: MDXItemProps) =>
    typeof props.children === "string" ? (
      <a href={`#${toSlug(props.children)}`} {...props} />
    ) : null,
  h6: (props: MDXItemProps) =>
    typeof props.children === "string" ? (
      <a
        className="wiki-context-menu-link px-4 pt-1 pb-3"
        href={`#${encodeURIComponent(props.children)}`}
        {...props}
      />
    ) : null,

  //ignore all other tags
  p: () => null,
  code: () => null,
  span: () => null,
  ul: () => null,
  ol: () => null,
  hr: () => null,
  div: () => null,
  table: () => null,
  blockquote: () => null,
  section: () => null,
};

interface Props {
  article?: React.ReactNode;
}

export default function Article({ article }: Props) {
  return (
    <>
      <Head>
        <title>HOLON en de kunst van het Loslaten</title>
        <meta name="description" content="HOLON en de kunst van het Loslaten" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <article className="prose mt-5 ml-10 mb-16 w-3/4">
        <RawHtml html={article} />
      </article>

      <nav className=" mx-3 w-1/4 border-l-2 border-gray-200">
        <div className="sticky top-0 mx-3 pt-5 ">
          <h3 className="px-4 pt-1 pb-3">
            <strong>Inhoudsopgave</strong>
          </h3>
          <div className="wiki-context-menu">{article}</div>
        </div>
      </nav>
    </>
  );
}
