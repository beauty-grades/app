"use client"

import Link from "next/link"
import { Button } from "@/ui/button"
import { useSession } from "next-auth/react"

export const AuthButton = () => {
  const { status } = useSession()

  if (status === "authenticated") {
    return (
      <Button variant="subtle">
        <Link href="/dashboard" className="text-white">
          Dashboard
        </Link>
      </Button>
    )
  } else if (status === "unauthenticated") {
    return (
      <Button variant="subtle">
        <a href="/api/auth/signin" className="text-white">
          Sign in
        </a>
      </Button>
    )
  } else {
    return null
  }
}
