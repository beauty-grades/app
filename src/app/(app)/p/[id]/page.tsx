import Link from "next/link"
import { SelectedPick } from "@xata.io/client"

import Xata from "@/lib/xata"
import { PostRecord } from "@/lib/xata/codegen"
import { PostList } from "@/components/post-list"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

const PostPage = async ({ params }: { params: { id: string } }) => {
  const post_id = "rec_" + params.id

  const post = await Xata.db.post.read(post_id, ["*", "author_profile.*"])

  if (!post?.author_profile || !post.embedding) return null

  const raw_similar_posts = await Xata.db.post.vectorSearch(
    "embedding",
    post.embedding,
    {
      size: 11,
    }
  )

  const still_raw_similar_posts = await Promise.all(
    raw_similar_posts.map(async ({ id }) => {
      if (id !== post_id) {
        const post = await Xata.db.post.read(id, ["*", "author_profile.*"])
        if (post) {
          return { ...post, xata: post.xata } as SelectedPick<
            PostRecord,
            ["author_profile.*", "*"]
          >
        }
      }
    })
  )

  const similar_posts = still_raw_similar_posts.filter(
    (el) => el !== undefined
  ) as SelectedPick<PostRecord, ["author_profile.*", "*"]>[]

  return (
    <div>
      <div className="flex gap-4">
        <Link href={`/u/${post.author_profile.handle}`}>
          <Avatar className="h-14 w-14">
            <AvatarImage src={post.author_profile.profile_picture || ""} />
            <AvatarFallback className="font-bold">
              {post.author_profile.name
                ? post.author_profile.name.split(" ")[0][0]
                : post.author_profile.handle
                ? post.author_profile.handle[0]
                : "*"}
            </AvatarFallback>
          </Avatar>
        </Link>
        <Link href={`/u/${post.author_profile.handle}`}>
          <p className="font-bold">{post.author_profile.name}</p>
          <p className="-mt-1 mb-1 text-sm text-muted-foreground">
            @{post.author_profile.handle}
          </p>
        </Link>
      </div>

      <div className="mt-2">
        <p className="text-lg">{post.body}</p>
      </div>

      <Separator className="my-4" />

      <div className="">
        <h2>Publicaciones similares</h2>
        <PostList posts={similar_posts} />
      </div>
    </div>
  )
}

export default PostPage
