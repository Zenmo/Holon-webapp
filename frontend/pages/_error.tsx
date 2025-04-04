import NextErrorComponent from "next/error"

const MyError = ({ statusCode, hasGetInitialPropsRun, err }) => {
    if (!hasGetInitialPropsRun && err) {
        // getInitialProps is not called in case of
        // https://github.com/vercel/next.js/issues/8592. As a workaround, we pass
        // err via _app.js so it can be captured
        Sentry.captureException(err)
        // Flushing is not required in this case as it only happens on the client
    }

    return <NextErrorComponent statusCode={statusCode} />
}

MyError.getInitialProps = async ({ res, err }) => {
    const errorInitialProps = await NextErrorComponent.getInitialProps({
        res,
        err,
    })

    // Workaround for https://github.com/vercel/next.js/issues/8592, mark when
    // getInitialProps has run
    errorInitialProps.hasGetInitialPropsRun = true

    // Running on the server, the response object (`res`) is available.
    //
    // Next.js will pass an err on the server if a page's data fetching methods
    // threw or returned a Promise that rejected
    //
    // Running on the client (browser), Next.js will provide an err if:
    //
    //  - a page's `getInitialProps` threw or returned a Promise that rejected
    //  - an exception was thrown somewhere in the React lifecycle (render,
    //    componentDidMount, etc) that was caught by Next.js's React Error
    //    Boundary. Read more about what types of exceptions are caught by Error
    //    Boundaries: https://reactjs.org/docs/error-boundaries.html
    if (res?.statusCode === 404) {
        // Opinionated: do not record an exception in Sentry for 404
        return { statusCode: 404 }
    }

    return errorInitialProps
}

export default MyError
