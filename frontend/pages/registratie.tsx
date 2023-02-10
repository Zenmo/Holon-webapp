import RegistrationForm from "@/components/Registration";
import { basePageWrap } from "@/containers/BasePage";

function RegistrationPage() {
  return <RegistrationForm />;
}

export default basePageWrap(RegistrationPage);
