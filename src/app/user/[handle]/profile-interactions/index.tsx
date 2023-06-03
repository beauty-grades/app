import { getEmail } from "@/lib/auth/get-email"
import Xata from "@/lib/xata"
import { ProfileInteractionsClient } from "./client-component"

export const ProfileInteractions = async ({
  profile_id,
  handle,
}: {
  profile_id: string
  handle: string
}) => {
  const email = await getEmail()

  if (!email) throw new Error("Unauthorized")

  const profile_a = await Xata.db.profile.filter({ email }).getFirstOrThrow()

  const rel_profiles = await Xata.db.rel_profiles
    .filter({
      "profile_a.id": profile_a.id,
    })
    .filter({
      "profile_b.id": profile_id,
    })
    .getFirst()

  const profile_stats = await Xata.db.profile_stats
    .filter({ "profile.id": profile_id })
    .getFirstOrThrow()

  return (
    <ProfileInteractionsClient
      profile_id={profile_id}
      handle={handle}
      initial_following={!!rel_profiles?.a_follows_b}
      initial_follower_count={profile_stats.follower_count}
      initial_following_count={profile_stats.following_count}
    />
  )
}
