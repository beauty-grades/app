import Link from "next/link"
import { Page, SelectedPick } from "@xata.io/client"

import { PostRecord } from "@/lib/xata/codegen"
import { DateHoverCard } from "@/components/date-hover-card"
import { ProfileHoverCard } from "@/components/profile-hover-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

export const PostCard = ({
  post,
}: {
  post: SelectedPick<PostRecord, ["*", "author_profile.*"]>
}) => {
  if (!post.author_profile) return null

  return (
    <div className="flex gap-4">
      <ProfileHoverCard profile={post.author_profile}>
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
      </ProfileHoverCard>
      <div className="flex flex-col">
        <div className="flex flex-wrap items-center gap-x-2">
          <ProfileHoverCard profile={post.author_profile}>
            <Link
              href={`/u/${post.author_profile.handle}`}
              className="flex gap-x-2"
            >
              <span className="font-bold hover:underline">
                {post.author_profile.name}
              </span>
            </Link>
          </ProfileHoverCard>
          <ProfileHoverCard profile={post.author_profile}>
            <Link
              href={`/u/${post.author_profile.handle}`}
              className="flex gap-x-2"
            >
              <span className="text-muted-foreground">
                @{post.author_profile.handle}
              </span>
            </Link>
          </ProfileHoverCard>
          {post.xata.createdAt && <DateHoverCard date={post.xata.createdAt} />}
        </div>
        <div className="text-muted"></div>
        <Link href={`/p/${post.id.replace("rec_", "")}`}>
          <p>{post.body}</p>{" "}
        </Link>
      </div>
    </div>
  )
}

export const PostListPaginated = ({
  page,
}: {
  page: Page<PostRecord, SelectedPick<PostRecord, ("author_profile.*" | "*")[]>>
}) => {
  return (
    <div className="flex flex-col">
      {page.records.map((post) => (
        <>
          <PostCard key={post.id} post={post} />
          <Separator className="my-4" />
        </>
      ))}
    </div>
  )
}

export const PostList = ({
  posts,
}: {
  posts: SelectedPick<PostRecord, ["*", "author_profile.*"]>[]
}) => {
  return (
    <div className="flex flex-col">
      {posts.map((post) => (
        <>
          <PostCard key={post.id} post={post} />
          <Separator className="my-4" />
        </>
      ))}
    </div>
  )
}
