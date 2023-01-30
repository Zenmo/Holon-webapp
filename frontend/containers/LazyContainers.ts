import dynamic from "next/dynamic";

export default {
  BasePage: dynamic(() => import("./BasePage")),
  HomePage: dynamic(() => import("./HomePage")),
  StaticPage: dynamic(() => import("./StaticPage")),
  NotFoundPage: dynamic(() => import("./NotFoundPage")),
  PasswordProtectedPage: dynamic(() => import("./PasswordProtectedPage")),
  PureHtmlPage: dynamic(() => import("./PureHtmlPage")),
  WikiPage: dynamic(() => import("./WikiPage")),
  CasusOverviewPage: dynamic(() => import("./CasusOverviewPage")),
  BestPracticePage: dynamic(() => import("./BestPracticePage")),
  CasusPage: dynamic(() => import("./CasusPage")),
  StorylinePage: dynamic(() => import("./StorylinePage")),
  ChallengeModePage: dynamic(() => import("./ChallengeModePage")),
  StorylineOverviewPage: dynamic(() => import("./StorylineOverviewPage")),
};
