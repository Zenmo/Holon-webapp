import type { Props } from "@/containers/BasePage/BasePage";
import UserProfile from "@/components/UserProfile";
import BasePage from "@/containers/BasePage/BasePage";
import { getPage } from "@/api/wagtail";

export default function TilesDemo({
  componentProps,
}: {
  componentProps: Props;
  children: React.ReactNode;
}) {
  return (
    <BasePage staticPageTitle="Profiel pagina" navigation={componentProps.navigation}>
      <UserProfile />
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
