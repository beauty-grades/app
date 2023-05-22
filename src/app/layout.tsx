import { Inter as FontSans } from "next/font/google"

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
    icon: "/icon.svg",
  },
}

const Layout: React.FunctionComponent<MainLayoutProps> = ({ children }) => {
  return (
    <html lang="es" className={fontSans.className}>
      <body className="bg-white font-sans text-slate-900 antialiased dark:bg-slate-900 dark:text-slate-50">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}

export default Layout
