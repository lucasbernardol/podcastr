import Document, { Head, Html, NextScript, Main } from 'next/document';

class DOM extends Document {
  render() {
    return (
      <Html lang="pt-br" translate="yes">
        <Head>
          <meta charSet="utf-8" />
          <link rel="shortcut icon" href="/favicon.png" />

          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter&family=Lexend:wght@500;600&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default DOM;
