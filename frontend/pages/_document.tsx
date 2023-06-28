import Document, { Head, Html, Main, NextScript } from "next/document";

class CustomDocument extends Document {
  public props;
  public pageProps;

  static async getInitialProps(ctx) {
    let pageProps = null;

    const originalRenderPage = ctx.renderPage;
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: App => props => {
          pageProps = props.pageProps;
          return <App {...props} />;
        },
        enhanceComponent: Component => Component,
      });

    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps, pageProps };
  }

  static defaultProps = {
    pageProps: {
      componentProps: {
        siteSetting: {},
      },
    },
  };

  render() {

    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CustomDocument;
