import type { Props } from "@/containers/BasePage/BasePage";
import { getPage } from "../api/wagtail";

import StaticPageWrap from "./_static-page-wrap";
import FloorPlan from "@/components/FloorPlan/FloorPlan";

export default function TilesDemo({
  componentProps,
}: {
  componentName: string;
  componentProps: Props;
  children: any;
}) {
  const { navigation }: Props = componentProps;

  return (
    <StaticPageWrap
      title={"dit is de titel"}
      navigation={navigation}
      componentProps={componentProps}>
      <FloorPlan />
    </StaticPageWrap>
  );
}

export async function getStaticProps({ params, preview, previewData }) {
  console.log("get static props");
  params = params || {};
  let path = params.path || [];
  path = path.join("/");

  const { json: pageData } = await getPage(path);
  return { props: pageData };
}
