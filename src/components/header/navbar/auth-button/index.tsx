"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"

export const AuthButton = () => {
  const { status } = useSession()

  if (status === "authenticated") {
    return (
      <Link href="/dashboard" className="text-white">
        <Button variant="secondary">Dashboard</Button>
      </Link>
    )
  } else if (status === "unauthenticated") {
    return (
      <Link href="/api/auth/signin" className="text-white">
        <Button variant="secondary">Sign in</Button>
      </Link>
    )
  } else {
    return null
  }
}
