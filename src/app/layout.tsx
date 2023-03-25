import { Inter as FontSans } from "@next/font/google"

import "./globals.css"
import { siteConfig } from "@/lib/site"
import ClientLayout from "./client-layout"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

interface MainLayoutProps {
  children: React.ReactNode
}

export const metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  icons: {
    icon: "/rounded-icon.svg",
  },
  verification: {
    other: {
      "facebook-domain-verification": ["ku3iedczjv7wodxrpt8gqwbsq9ytd6"],
    },
  },
}

const Layout: React.FunctionComponent<MainLayoutProps> = ({ children }) => {
  return (
    <html lang="es" className={fontSans.className}>
      <ClientLayout>{children}</ClientLayout>
    </html>
  )
}

export default Layout
