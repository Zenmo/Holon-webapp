import UserProfile from "@/components/UserProfile/UserProfile";
import { basePageWrap } from "@/containers/BasePage";

function ProfilePage() {
  return <UserProfile />;
}

export default basePageWrap(ProfilePage);
