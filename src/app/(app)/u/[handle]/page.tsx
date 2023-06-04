import { Page, SelectedPick } from "@xata.io/client"

import { getProfile } from "@/lib/queries/get-profile"
import Xata from "@/lib/xata"
import { PostRecord } from "@/lib/xata/codegen"
import { PostListPaginated } from "@/components/post-list"

const HomePage = async ({ params }) => {
  const profile = await getProfile(params.handle)
  const raw_page = await Xata.db.post
    .filter({ author_profile: profile.id })
    .select(["*", "author_profile.id"])
    .getPaginated({
      sort: { "xata.createdAt": "desc" },
    })
  const parsed_page = {
    ...raw_page,
    records: raw_page.records.map((post) => ({
      ...post,
      author_profile: profile,
      xata: post.xata,
    })),
  } as Page<PostRecord, SelectedPick<PostRecord, ("author_profile.*" | "*")[]>>

  return <PostListPaginated page={parsed_page} />
}

export default HomePage
