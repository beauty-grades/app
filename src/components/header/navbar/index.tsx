import Link from "next/link"
import { Icons } from "@/components/ui/icons"

import { AuthButton } from "./auth-button"
import { ThemeToggle } from "./theme-toggle"
import { siteConfig } from "@/lib/site"

const Navbar = () => {
  return (
    <nav className="container sticky top-0 z-50 flex items-center justify-between bg-background py-2">
      <Link href="/" className="flex items-center">
        <Icons.logo className="h-8 w-8 fill-current" />
        <span className="ml-2 mr-8 font-bold">{siteConfig.name}</span>
      </Link>

      <div className="flex items-center justify-end space-x-4">
        <AuthButton />
        <ThemeToggle />
      </div>
    </nav>
  )
}

export default Navbar
