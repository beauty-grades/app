"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import useSWR  from 'swr';

export const AuthButton = () => {
  const { status } = useSession()
  const {data, error} = useSWR('/api/user')


  if (status === "authenticated" && data?.profile && !error) {
    if (!data.profile.handle) {
      return (
        <Link href="/settings">
          <Button variant="secondary">Continuar</Button>
        </Link>
      )
    }
    return (
      <Link href={`/@${data.profile.handle}`}>
        <Button variant="secondary">@{data.profile.handle}</Button>
      </Link>
    )
  } else if (status === "unauthenticated") {
    return (
      <Link href="/api/auth/signin">
        <Button variant="secondary">Sign in</Button>
      </Link>
    )
  } else {
    return null
  }
}
