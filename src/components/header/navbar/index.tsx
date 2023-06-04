import { Suspense } from "react"
import Link from "next/link"

import { siteConfig } from "@/lib/site"
import { Icons } from "@/components/ui/icons"
import { AuthButton } from "./auth-button"
import { ThemeToggle } from "./theme-toggle"

const Navbar = () => {
  return (
    <div className="sticky top-0 z-50 mb-2 border-b">
      <nav className="container flex h-16 items-center justify-between bg-background">
        <Link href="/" className="flex items-center">
          <Icons.logo className="h-8 w-8 fill-current" />
          <span className="ml-2 mr-8 font-bold">{siteConfig.name}</span>
        </Link>

        <div className="flex items-center justify-end space-x-4">
          <Suspense fallback={<div>Loading...</div>}>
            <AuthButton />
          </Suspense>
          <ThemeToggle />
        </div>
      </nav>
    </div>
  )
}

export default Navbar
