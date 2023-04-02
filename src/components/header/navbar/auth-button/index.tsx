"use client"

import Link from "next/link"
import { Button } from "@/ui/button"
import { useSession } from "next-auth/react"

export const AuthButton = () => {
  const { status } = useSession()

  if (status === "authenticated") {
    return (
      <Link href="/dashboard" className="text-white">
        <Button variant="subtle">Dashboard</Button>
      </Link>
    )
  } else if (status === "unauthenticated") {
    return (
      <Link href="/api/auth/signin" className="text-white">
        <Button variant="subtle">Sign in</Button>
      </Link>
    )
  } else {
    return null
  }
}
