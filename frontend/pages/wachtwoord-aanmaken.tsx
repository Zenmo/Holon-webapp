import NewPasswordCreate from "@/components/NewPasswordCreate/NewPasswordCreate";
import { basePageWrap } from "@/containers/BasePage";

function NewPasswordCreatePage() {
  return <NewPasswordCreate />;
}

export default basePageWrap(NewPasswordCreatePage);
