import NewPasswordRequest from "@/components/NewPasswordRequest/NewPasswordRequest";
import { basePageWrap } from "@/containers/BasePage";

function NewPasswordRequestPage() {
  return <NewPasswordRequest />;
}

export default basePageWrap(NewPasswordRequestPage);
