import { cache } from "react"
import { redirect } from "next/navigation"

import Xata from "@/lib/xata"
import {
  getMyEmail,
  getMyEmailOrSignIn,
  getMyEmailOrThrow,
} from "./get-my-email"

export const getMyProfile = cache(async () => {
  try {
    const email = await getMyEmailOrSignIn()
    const profile = await Xata.db.profile.filter({ email }).getFirstOrThrow()
    return profile
  } catch (error) {
    redirect("/settings")
  }
})
