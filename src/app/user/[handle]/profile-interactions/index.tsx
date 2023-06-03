import Link from "next/link"

import { getMyProfile } from "@/lib/auth/get-my-profile"
import Xata from "@/lib/xata"
import { Button } from "@/components/ui/button"
import { ProfileInteractionsClient } from "./client-component"

export const ProfileInteractions = async ({
  profile_id,
  handle,
}: {
  profile_id: string
  handle: string
}) => {
  const profile_a = await getMyProfile()

  const rel_profiles = await Xata.db.rel_profiles
    .filter({
      "profile_a.id": profile_a.id,
    })
    .filter({
      "profile_b.id": profile_id,
    })
    .getFirst()

  const profile_b_stats = await Xata.db.profile_stats
    .filter({ "profile.id": profile_id })
    .getFirstOrThrow()

  return (
    <ProfileInteractionsClient
      is_my_profile={profile_a.id === profile_id}
      profile_id={profile_id}
      handle={handle}
      initial_following={!!rel_profiles?.a_follows_b}
      initial_follower_count={profile_b_stats.follower_count}
      initial_following_count={profile_b_stats.following_count}
    />
  )
}
