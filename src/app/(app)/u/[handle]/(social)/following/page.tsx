import { getProfile } from "@/lib/queries/get-profile";
import xata from "@/lib/xata";
import { ProfileListPaginated } from "@/components/profile";
import { Heading } from "@/components/ui/typography";

export const revalidate = 10000;

const FollowingPage = async ({ params }) => {
  const handle = params.handle;
  const profile = await getProfile(handle);

  const following = await xata.db.rel_profiles
    .filter({ profile_a: profile.id })
    .filter({ a_follows_b: true })
    .select(["*", "profile_b.*"])
    .getPaginated({
      pagination: {
        size: 50,
      },
    });

  return (
    <div>
      <Heading as="h3">Siguiendo</Heading>
      {/* @ts-ignore */}

      <ProfileListPaginated profiles_page={following} />
    </div>
  );
};

export default FollowingPage;
