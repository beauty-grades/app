import { type RequestCookies } from "next/dist/compiled/@edge-runtime/cookies"
import { type ReadonlyRequestCookies } from "next/dist/server/app-render"

import Xata from "@/lib/xata"

export const getEmail = async (
  cookies: RequestCookies | ReadonlyRequestCookies
) => {
  const session_token = cookies.get(
    process.env.VERCEL
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token"
  )?.value

  if (!session_token) {
    return null
  }

  const raw_session = await Xata.db.nextauth_sessions
    .select(["*", "user.email"])
    .filter({ sessionToken: session_token })
    .getFirst()

  const email = raw_session?.user?.email ?? null

  return email
}
