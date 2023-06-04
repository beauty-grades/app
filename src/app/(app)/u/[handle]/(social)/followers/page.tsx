import { getProfile } from "@/lib/queries/get-profile"
import Xata from "@/lib/xata"
import { ProfileListPaginated } from "@/components/profile-list"
import { Heading } from "@/components/ui/typography"

export const revalidate = 1000

const FollowersPage = async ({ params }) => {
  const handle = params.handle
  const profile = await getProfile(handle)

  const followers = await Xata.db.rel_profiles
    .filter({ profile_b: profile.id })
    .filter({ a_follows_b: true })
    .select(["*", "profile_a.*"])
    .getPaginated({
      pagination: {
        size: 50,
      },
    })

  return (
    <div>
      <Heading as="h3">Seguidores</Heading>
      <ProfileListPaginated profiles_page={followers} />
    </div>
  )
}

export default FollowersPage
