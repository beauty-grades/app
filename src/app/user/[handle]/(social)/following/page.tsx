import Xata from "@/lib/xata"
import { getProfile } from "../../get-profile"
import { ProfileListPaginated } from "../profile-list-paginated"
import {Heading} from "@/components/ui/typography"
export const revalidate = 1000

const FollowingPage = async ({ params }) => {
  const handle = params.handle
  const profile = await getProfile(handle)

  const following = await Xata.db.rel_profiles
    .filter({ profile_a: profile.id })
    .filter({ a_follows_b: true })
    .select(["*", "profile_b.*"])
    .getPaginated({
      pagination: {
        size: 50,
      },
    })

  return (
    <div>
      <Heading as="h3">Siguiendo</Heading>
      <ProfileListPaginated profiles_page={following} />
    </div>
  )
}

export default FollowingPage
