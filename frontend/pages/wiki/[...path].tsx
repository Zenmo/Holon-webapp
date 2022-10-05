import querystring from "querystring";
import { getPage, getRedirect, getAllPages, WagtailApiResponseError } from "../../api/wagtail";
import LazyContainers from "../../containers/LazyContainers";

const isProd = process.env.NODE_ENV === "production";

export default function CatchAllPage({ componentName, componentProps }) {
  const Component = LazyContainers[componentName];
  if (!Component) {
    return <h1>Component {componentName} not found</h1>;
  }
  return <Component {...componentProps} />;
}

// For SSG
export async function getStaticProps({ params, preview, previewData }) {
  params = params || {};
  let path = params.path || [];
  path = path.join("/");

  const { json: pageData } = await getPage(path);
  return { props: pageData };
}

export async function getStaticPaths() {
  const { json: data } = await getAllPages();

  let htmlUrls = data.items.map(x => x.relativeUrl);
  htmlUrls = htmlUrls.filter(x => x);
  htmlUrls = htmlUrls.map(x => x.split("/"));
  htmlUrls = htmlUrls.map(x => x.filter(y => y));
  htmlUrls = htmlUrls.filter(x => x.length);

  const paths = htmlUrls.map(x => ({ params: { path: x } }));

  return {
    paths: paths,
    fallback: false,
  };
}
