import {
  NextResponse,
  type NextFetchEvent,
  type NextRequest,
} from "next/server"

import { getEmail } from "@/lib/utils/auth/get-email"
import Xata from "@/lib/xata"

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  const email = await getEmail(req.cookies)

  if (email) {
    const user = await Xata.db.student
      .select(["*"])
      .filter({ email })
      .getFirst()

    // continue only if the token was stored recently (less than 4 hours ago)
    if (
      user?.utec_token_v1 &&
      user?.utec_token_v2 &&
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
          console.log("Starting to populate feed for user", email)
          event.waitUntil(
            fetch(`${process.env.FEED_API_URL}/api/feed`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                utec_token_v1: user.utec_token_v1,
                utec_token_v2: user.utec_token_v2,
              }),
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
    console.log("No email found for session token")
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/feed"],
}
