import type { Props } from "@/containers/BasePage/BasePage";
import RegistrationForm from "@/components/Registration";
import BasePage from "@/containers/BasePage/BasePage";
import { getPage } from "@/api/wagtail";

export default function TilesDemo({
  componentProps,
}: {
  componentProps: Props;
  children: React.ReactNode;
}) {
  return (
    <BasePage staticPageTitle="Registratie" navigation={componentProps.navigation}>
      <RegistrationForm />
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
