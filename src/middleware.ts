import {
  NextResponse,
  type NextFetchEvent,
  type NextRequest,
} from "next/server"

import Xata from "@/lib/xata"

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  let session_token = req.cookies.get(
    process.env.VERCEL
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token"
  )?.value

  if (session_token) {
    const raw_session = await Xata.db.nextauth_sessions
      .select(["*", "user.email"])
      .filter({ sessionToken: session_token })
      .getFirst()

    const email = raw_session?.user?.email

    if (email) {
      const user = await Xata.db.student
        .select(["*"])
        .filter({ email })
        .getFirst()

      // continue only if the token was stored recently (less than 4 hours ago)
      if (
        user?.utec_token &&
        user.last_token_stored_at &&
        new Date().getTime() - user.last_token_stored_at.getTime() <
          4 * 60 * 60 * 1000
      ) {
        // populate at most once every 24 hours
        if (
          !user.last_populated_at ||
          new Date().getTime() - user.last_populated_at.getTime() >
            24 * 60 * 60 * 1000
        ) {
          if (user.populating) {
            console.log("User", email, "is already populating. Skipping...")
          } else {
            event.waitUntil(
              fetch("https://beauty-grades-api.up.railway.app/api/populate", {
                method: "POST",
                headers: {
                  Authorization: user.utec_token,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
              })
            )
            return NextResponse.next()
          }
        } else {
          console.log("Skipping population for user", email)
        }
      } else {
        console.log("No valid token found for user", email)
      }
    } else {
      console.log("No email found for session token", session_token)
    }
  } else {
    console.log("No session token found")
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/populate"],
}
