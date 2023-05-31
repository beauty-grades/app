"use client"

import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/react"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "next-themes"
import { Provider as WrapBalancerProvider } from "react-wrap-balancer"
import { SWRConfig } from "swr"

import { Footer } from "@/components/footer"
import Header from "@/components/header"

const ClientLayout = ({ children }) => {
  return (
    <SessionProvider>
      <SWRConfig
        value={{
          refreshInterval: 3000,
          fetcher: (resource, init) =>
            fetch(resource, init).then((res) => res.json()),
        }}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <WrapBalancerProvider>
            <div className="flex min-h-[150vh] flex-col">
              <Header />
              {children}
              <Footer />
            </div>
            <Toaster />
          </WrapBalancerProvider>
          <Analytics />
        </ThemeProvider>
      </SWRConfig>
    </SessionProvider>
  )
}

export default ClientLayout
