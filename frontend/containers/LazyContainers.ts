import dynamic from "next/dynamic"

export default {
    BasePage: dynamic(() => import("./BasePage")),
    HomePage: dynamic(() => import("./HomePage")),
    StaticPage: dynamic(() => import("./StaticPage")),
    NotFoundPage: dynamic(() => import("./NotFoundPage")),
    PasswordProtectedPage: dynamic(() => import("./PasswordProtectedPage")),
    PureHtmlPage: dynamic(() => import("./PureHtmlPage")),
    WikiPage: dynamic(() => import("./WikiPage")),
    CasusOverviewPage: dynamic(() => import("./CasusOverviewPage")),
    BestPracticeOverviewPage: dynamic(() => import("./BestPracticeOverviewPage")),
    BestPracticePage: dynamic(() => import("./BestPracticePage")),
    CasusPage: dynamic(() => import("./CasusPage")),
    StorylinePage: dynamic(() => import("./StorylinePage")),
    ChallengeModePage: dynamic(() => import("./ChallengeModePage")),
    SandboxPage: dynamic(() => import("./SandboxPage")),
    InteractiveOverviewPage: dynamic(() => import("./InteractiveOverviewPage")),
    StorylineOverviewPage: dynamic(() => import("./StorylineOverviewPage")),
    LoginPage: dynamic(() => import("./LoginPage")),
    RegistrationPage: dynamic(() => import("./RegistrationPage")),
    NewPasswordPage: dynamic(() => import("./NewPasswordPage")),
    ResetPasswordPage: dynamic(() => import("./ResetPasswordPage")),
    UserProfilePage: dynamic(() => import("./UserProfilePage")),
}
