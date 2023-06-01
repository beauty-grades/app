import { cache } from "react"

import Xata from "@/lib/xata"

export const getProfile = cache(async (handle: string | undefined | null) => {
  try {
    const profile = await Xata.db.profile.filter({ handle }).getFirst()

    return profile
  } catch (error) {
    return null
  }
})
