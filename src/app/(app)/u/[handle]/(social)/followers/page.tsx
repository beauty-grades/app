import { getProfile } from "@/lib/queries/get-profile";
import xata from "@/lib/xata";
import { ProfileListPaginated } from "@/components/profile";
import { Heading } from "@/components/ui/typography";

const FollowersPage = async ({ params }) => {
  const handle = params.handle;
  const profile = await getProfile(handle);

  const followers = await xata.db.rel_profiles
    .filter({ profile_b: profile.id })
    .filter({ a_follows_b: true })
    .select(["*", "profile_a.*"])
    .getPaginated({
      pagination: {
        size: 50,
      },
    });

  return (
    <div>
      <Heading as="h3">Seguidores</Heading>
      {/* @ts-ignore */}
      <ProfileListPaginated profiles_page={followers} />
    </div>
  );
};

export default FollowersPage;
