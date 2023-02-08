import type { Props } from "@/containers/BasePage/BasePage";
import BasePage from "@/containers/BasePage/BasePage";
import { getPage } from "@/api/wagtail";
import LoginForm from "@/components/Login/LoginForm";

export default function TilesDemo({
  componentProps,
}: {
  componentProps: Props;
  children: React.ReactNode;
}) {
  return (
    <BasePage staticPageTitle="Inloggen" navigation={componentProps.navigation}>
      <LoginForm />
    </BasePage>
  );
}
export async function getStaticProps({ params }) {
  console.log("get static props");
  params = params || {};
  let path = params.path || [];
  path = path.join("/");

  const { json: pageData } = await getPage(path);
  return { props: pageData };
}
