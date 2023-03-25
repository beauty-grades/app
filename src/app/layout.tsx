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
}

const Layout: React.FunctionComponent<MainLayoutProps> = ({ children }) => {
  return (
    <html lang="es" className={fontSans.className}>
      <body className="bg-white font-sans text-zinc-900 antialiased dark:bg-zinc-900 dark:text-zinc-50">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}

export default Layout
