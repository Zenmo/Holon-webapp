import TableBlock from "@/components/Blocks/TableBlock/TableBlock";
import Head from "next/head";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import ParagraphBlock from "../Blocks/ParagraphBlock";

type Content = PageProps<TextAndMediaVariant | TitleBlockVariant | CardBlockVariant>;

export default function Article({ article }: { article: Content[] }) {
  const tableOfContents = [];

  const transformAndExtractHeadings = (html: string) => {
    const content = unified()
      .use(rehypeParse, {
        fragment: true,
      })
      .use(() => {
        return tree => {
          visit(tree, "element", node => {
            if (node.tagName == "h2" || node.tagName == "h3") {
              if (node.children[0].value !== undefined) {
                const id = encodeURI(node.children[0].value);
                node.properties.id = id;
                tableOfContents.push({
                  id,
                  title: node.children[0].value,
                });
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
      .processSync(html)
      .toString();

    return content;
  };

  return (
    <>
      <Head>
        <title>HOLON Wiki</title>
        <meta name="description" content="HOLON Wiki" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <article className="prose mt-5 mb-16 max-w-none">
        {article?.map(contentItem => {
          switch (contentItem.type) {
            case "paragraph_block":
              contentItem.value.text = transformAndExtractHeadings(contentItem.value.text);
              return (
                <ParagraphBlock
                  key={`paragraphBlock ${contentItem.id}`}
                  data={contentItem}
                  ignoreLayout={true}
                />
              );
            case "table_block":
              return (
                <div className="holonContentContainer defaultBlockPadding">
                  <TableBlock key={`tableBlock ${contentItem.id}`} data={contentItem} />
                </div>
              );
            default:
              null;
          }
        })}
      </article>

      <nav className=" mx-3 w-1/4 border-l-2 border-gray-200">
        <div className="sticky top-0 mx-3 pt-5 ">
          <h3 className="px-4 pt-1 pb-3">
            <strong>Op deze pagina</strong>
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
