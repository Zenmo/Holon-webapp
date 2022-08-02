import ReactGA from "react-ga";

export const initGA = () => {
  ReactGA.initialize("G-EHMXV36KJV");
  ReactGA.pageview(window.location.pathname + window.location.search);
  ReactGA.ga("send", "pageview", "/mypage");
};
