import { Inter as FontSans } from "next/font/google"

import "@uploadthing/react/styles.css"
import "@/styles/globals.css"

import { siteConfig } from "@/lib/site"
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
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}

export default Layout
