import LoginForm from "@/components/Authentication/LoginForm";
import { basePageWrap } from "@/containers/BasePage";

function LoginPage() {
  return <LoginForm />;
}

export default basePageWrap(LoginPage);
