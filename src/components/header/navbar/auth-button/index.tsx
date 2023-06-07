import Link from "next/link"

import { getMyEmail } from "@/lib/auth/get-my-email"
import { getMyProfile } from "@/lib/auth/get-my-profile"
import { Button } from "@/components/ui/button"

export const AuthButton = async () => {
  const email = await getMyEmail()
  if (!email) {
    return (
      <Link href="/api/auth/signin">
        <Button variant="secondary">Sign in</Button>
      </Link>
    )
  } else {
    const profile = await getMyProfile()

    if (profile) {
      return (
        <>
          <Link href="/status/create">
            <Button variant="secondary">Publicar</Button>
          </Link>
          <Link href={`/u/${profile.handle}`}>
            <Button variant="secondary">@{profile.handle}</Button>
          </Link>
        </>
      )
    } else {
      return (
        <Link href={`/settings`}>
          <Button variant="secondary">Continuar</Button>
        </Link>
      )
    }
  }
}
