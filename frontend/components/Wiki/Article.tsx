import Head from "next/head";
import RawHtml from "../RawHtml";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import { useEffect, useState } from "react";
import parameterize from "parameterize";

interface Props {
  article?: React.ReactNode;
}

export default function Article({ article }: Props) {
  const [content, setContent] = useState(article);
  const [tableOfContents, setTableOfContents] = useState([]);

  useEffect(() => {
    const toc = [];
    const content = unified()
      .use(rehypeParse, {
        fragment: true,
      })
      .use(() => {
        return tree => {
          visit(tree, "element", node => {
            if (node.tagName == "h2" || node.tagName == "h3") {
              if (node.children[0].value !== undefined) {
                const id = parameterize(node.children[0].value);
                node.properties.id = id;
                toc.push({
                  id,
                  title: node.children[0].value,
                });
                setTableOfContents(toc);
              } else {
                console.log(
                  "error: node h2/h3 can not be found. check if headings are not strong or italic..."
                );
              }
            }
          });
        };
      })
      .use(rehypeStringify)
      .processSync(article)
      .toString();

    setContent(content);
  }, [article]);

  return (
    <>
      <Head>
        <title>HOLON en de kunst van het Loslaten</title>
        <meta name="description" content="HOLON en de kunst van het Loslaten" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <article className="prose mt-5 ml-10 mb-16 w-3/4">
        <RawHtml html={content} />
      </article>

      <nav className=" mx-3 w-1/4 border-l-2 border-gray-200">
        <div className="sticky top-0 mx-3 pt-5 ">
          <h3 className="px-4 pt-1 pb-3">
            <strong>Inhoudsopgave</strong>
          </h3>
          <div className="wiki-context-menu">
            <ul>
              {tableOfContents.map((item, index) => {
                return (
                  <li key={index}>
                    <a className="wiki-context-menu-link px-4 pt-1 pb-3" href={`#${item.id}`}>
                      {item.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
