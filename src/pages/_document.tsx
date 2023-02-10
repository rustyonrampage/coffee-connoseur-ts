import Document, { Html, Head, Main, NextScript } from "next/document";

// export default function Document() {
//   return (
//     <Html lang="en">
//       <Head />
//       <body>
//         <Main />
//         <NextScript />
//       </body>
//     </Html>
//   )
// }

class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="en">
        <Head>
          <link
            rel="preload"
            as="font"
            crossOrigin="anonymous"
            href="/fonts/IBMPlexSans-Bold.ttf"
          />
          <link
            rel="preload"
            as="font"
            crossOrigin="anonymous"
            href="/fonts/IBMPlexSans-Regular.ttf"
          />
          <link
            rel="preload"
            as="font"
            crossOrigin="anonymous"
            href="/fonts/IBMPlexSans-SemiBold.ttf"
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

export default MyDocument;
