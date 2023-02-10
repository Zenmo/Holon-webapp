import type { Props } from "@/containers/BasePage/BasePage";
import FloorPlan from "@/components/FloorPlan/FloorPlan";
import BasePage from "@/containers/BasePage/BasePage";
import { getPage } from "@/api/wagtail";

export default function TilesDemo({
  componentProps,
}: {
  componentProps: Props;
  children: React.ReactNode;
}) {
  return (
    <BasePage staticPageTitle="Tiles demo" navigation={componentProps.navigation}>
      <FloorPlan />
    </BasePage>
  );
}
export async function getStaticProps({ params }) {
  params = params || {};
  let path = params.path || [];
  path = path.join("/");

  const { json: pageData } = await getPage(path);
  return { props: pageData };
}
