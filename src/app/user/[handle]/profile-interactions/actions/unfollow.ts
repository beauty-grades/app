"use server"

import { getMyProfile } from "@/lib/auth/get-my-profile"
import Xata from "@/lib/xata"

export async function unfollow(profile_id: string) {
  const profile_a = await getMyProfile()
  const profile_b = await Xata.db.profile.read(profile_id)
  if (!profile_b) throw new Error("Profile not found")

  const rel_users = await Xata.db.rel_profiles
    .filter({
      "profile_a.id": profile_a.id,
      "profile_b.id": profile_b.id,
    })
    .getFirst()

  if (rel_users) {
    if (!rel_users.a_follows_b) {
      throw new Error("You are not following this user")
    }

    await rel_users.update({
      a_follows_b: false,
    })
  } else {
    await Xata.db.rel_profiles.create({
      profile_a: profile_a.id,
      profile_b: profile_b.id,
      a_follows_b: false,
    })
  }

  const profile_b_stats = await Xata.db.profile_stats
    .filter({ profile: profile_b.id })
    .getFirstOrThrow()

  await profile_b_stats.update({
    follower_count: { $decrement: 1 },
  })

  const profile_a_stats = await Xata.db.profile_stats
    .filter({ profile: profile_a.id })
    .getFirstOrThrow()

  await profile_a_stats.update({
    following_count: { $decrement: 1 },
  })
}
