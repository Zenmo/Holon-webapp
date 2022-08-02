import ReactGA from "react-ga";

export const initGA = () => {
  ReactGA.initialize("G-EHMXV36KJV", { testMode: true });
  ReactGA.pageview(window.location.pathname + window.location.search);
  ReactGA.ga("send", "pageview", "/mypage");
};
