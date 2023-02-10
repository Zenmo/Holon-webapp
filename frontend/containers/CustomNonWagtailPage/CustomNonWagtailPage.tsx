// import i18n from '../../i18n';
import { basePageWrap } from "@/containers/BasePage";
import LoginForm from "@/components/Login";
import RegistrationForm from "@/components/Registration";
import UserProfile from "@/components/UserProfile";
import FloorPlan from "@/components/FloorPlan/FloorPlan";
import NewPasswordCreate from "@/components/NewPasswordCreate";
import NewPasswordRequest from "@/components/NewPasswordRequest";
import InteractiveImage from "@/components/InteractiveImage/InteractiveImage";

const CustomNonWagtailPage = ({ type }) => {
  const componentToShow = () => {
    switch (type) {
      case "login":
        return <LoginForm />;
      case "registratie":
        return <RegistrationForm />;
      case "profiel":
        return <UserProfile />;
      case "tiles-demo":
        return <FloorPlan />;
      case "wachtwoord-aanmaken":
        return <NewPasswordCreate />;
      case "wachtwoord-aanvragen":
        return <NewPasswordRequest />;
      case "animation-demo":
        return <InteractiveImage />;
      default:
        return "No component to show";
    }
  };

  return <div>{componentToShow()}</div>;
};

export default basePageWrap(CustomNonWagtailPage);
