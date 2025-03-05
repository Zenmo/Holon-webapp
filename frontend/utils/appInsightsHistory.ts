import { ReactPlugin } from "@microsoft/applicationinsights-react-js"
import { ApplicationInsights } from "@microsoft/applicationinsights-web"

const defaultBrowserHistory = {
    url: "/",
    location: { pathname: "" },
    listen: () => {},
}

let browserHistory = defaultBrowserHistory
if (typeof window !== "undefined") {
    browserHistory = { ...browserHistory, ...window.history }
    browserHistory.location.pathname = browserHistory?.state?.url
}

const reactPlugin = new ReactPlugin()
const appInsights = new ApplicationInsights({
    config: {
        instrumentationKey: "bb6563f2-f484-443e-9a27-09168b466be3",
        distributedTracingMode: 2, // DistributedTracingModes.W3C
        extensions: [reactPlugin],
        extensionConfig: {
            [reactPlugin.identifier]: { history: browserHistory },
        },
    },
})

// Prevent loading twice in case the user clears cookies and then accepts the cookie banner again.
let isLoaded = false

const loadAppInsights = () => {
    if (typeof window !== "undefined" && !isLoaded) {
        isLoaded = true
        appInsights.loadAppInsights()
    }
}

export { loadAppInsights, reactPlugin }
