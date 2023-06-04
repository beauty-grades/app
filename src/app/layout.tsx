import { Inter as FontSans } from "next/font/google"

import "@/styles/globals.css"

import { siteConfig } from "@/lib/site"
import { Footer } from "@/components/footer"
import Header from "@/components/header"
import ClientLayout from "./client-layout"

const fontSans = FontSans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
})

interface MainLayoutProps {
  children: React.ReactNode
}

export const metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  icons: {
    icon: "/icon.svg",
  },
}

const Layout: React.FunctionComponent<MainLayoutProps> = ({ children }) => {
  return (
    <html className={fontSans.variable} lang="es" suppressHydrationWarning>
      <head />
      <body>
        <ClientLayout>
          <div className="flex min-h-[150vh] flex-col">
            <Header />
            <div className="container">{children}</div>
            <Footer />
          </div>
        </ClientLayout>
      </body>
    </html>
  )
}

export default Layout
