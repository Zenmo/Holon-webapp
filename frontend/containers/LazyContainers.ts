import dynamic from "next/dynamic";

export default {
  BasePage: dynamic(() => import("./BasePage")),
  HomePage: dynamic(() => import("./HomePage")),
  StaticPage: dynamic(() => import("./StaticPage")),
  NotFoundPage: dynamic(() => import("./NotFoundPage")),
  PasswordProtectedPage: dynamic(() => import("./PasswordProtectedPage")),
  PureHtmlPage: dynamic(() => import("./PureHtmlPage")),
  StorylinePage: dynamic(() => import("./StorylinePage")),
  WikiPage: dynamic(() => import("./WikiPage")),
};
