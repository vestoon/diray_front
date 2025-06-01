import { ThemeProvider } from "next-themes"
import { SessionProvider } from "next-auth/react"
import "../styles/globals.css"
import Layout from "../components/Layout"

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  // 세션 스토리지에서 임시 세션 가져오기
  const mockSession = typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("mockSession") || "null") : null
  const currentSession = session || mockSession

  return (
    <SessionProvider session={currentSession}>
      <ThemeProvider attribute="class">
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </SessionProvider>
  )
}

export default MyApp
