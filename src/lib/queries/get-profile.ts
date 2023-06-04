import { cache } from "react"
import { notFound } from "next/navigation"

import Xata from "@/lib/xata"

export const getProfile = cache(async (handle: string | undefined | null) => {
  try {
    const profile = await Xata.db.profile.filter({ handle }).getFirstOrThrow()
    return profile
  } catch (error) {
    notFound()
  }
})
