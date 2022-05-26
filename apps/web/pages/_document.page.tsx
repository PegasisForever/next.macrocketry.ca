import Document, {DocumentContext, Head, Html, Main, NextScript} from 'next/document'
import { createGetInitialProps } from '@mantine/next'

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    return {
      ...await Document.getInitialProps(ctx),
      ...createGetInitialProps()(ctx),
    }
  }

  render() {
    return (
      <Html lang={'en'}>
        <Head>
          <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&display=swap" rel="stylesheet"/>
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
          <link rel="manifest" href="/site.webmanifest"/>
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"/>
          <meta name="msapplication-TileColor" content="#da532c"/>
          <meta name="theme-color" content="#ffffff"/>
        </Head>
        <body>
        <Main/>
        <NextScript/>
        </body>
      </Html>
    )
  }
}