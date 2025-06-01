import { ThemeProvider } from "next-themes"
import { SessionProvider } from "next-auth/react"
import "../styles/globals.css"
import Layout from "../components/Layout"

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class">
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </SessionProvider>
  )
}

export default MyApp
