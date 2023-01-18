import LoginForm from "@/components/Login/LoginForm";
import { basePageWrap } from "@/containers/BasePage";

function LoginPage() {
  return <LoginForm />;
}

export default basePageWrap(LoginPage);
