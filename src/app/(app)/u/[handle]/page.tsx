import { Page, SelectedPick } from "@xata.io/client";

import { getProfile } from "@/lib/queries/get-profile";
import xata from "@/lib/xata";
import { StatusRecord } from "@/lib/xata/codegen";
import { StatusListPaginated } from "@/components/status/status-list-paginated";

const HomePage = async ({ params }) => {
  const profile = await getProfile(params.handle);
  const raw_page = await xata.db.status
    .filter({ author_profile: profile.id })
    .select(["*", "author_profile.id"])
    .getPaginated({
      sort: { "xata.createdAt": "desc" },
    });
  const parsed_page = {
    ...raw_page,
    records: raw_page.records.map((status) => ({
      ...status,
      author_profile: profile,
      xata: status.xata,
    })),
  } as Page<
    StatusRecord,
    SelectedPick<StatusRecord, ("author_profile.*" | "*")[]>
  >;

  return <StatusListPaginated page={parsed_page} />;
};

export default HomePage;
