import * as React from "react"
import Link from "next/link"
import { Page, SelectedPick } from "@xata.io/client"

import { cn } from "@/lib/utils"
import Xata from "@/lib/xata"
import { PostRecord } from "@/lib/xata/codegen"
import { DateHoverCard } from "@/components/date-hover-card"
import { ProfileHoverCard } from "@/components/profile-hover-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

const PostDynamicBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(async ({ className, children, ...props }, ref) => {
  if (typeof children !== "string") return

  const pattern = /@(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])/g
  const matches = Array.from(children.match(pattern) || []).map((el) =>
    el.replace("@", "")
  )

  if (!matches || matches.length === 0)
    return (
      <div ref={ref} className={cn(className)} {...props}>
        <span>{children}</span>
      </div>
    )

  const profiles = await Xata.db.profile
    .filter({
      handle: { $any: matches },
    })
    .getAll()

  const existing_profiles = profiles.map((p) => p.handle as string)

  if (existing_profiles.length === 0)
    return (
      <div ref={ref} className={cn(className)} {...props}>
        <span>{children}</span>
      </div>
    )

  let react_nodes: Array<React.ReactNode> = []

  let string_to_check: string = children

  while (true) {
    let [static_string, ...rest] = string_to_check.split("@")
    react_nodes.push(<span>{static_string}</span>)

    string_to_check = string_to_check.replace(static_string, "")

    let handle_to_test_index = 0

    let replaced = false
    while (true) {
      if (handle_to_test_index === existing_profiles.length) break

      if (
        string_to_check.startsWith(
          "@" + existing_profiles[handle_to_test_index]
        )
      ) {
        react_nodes.push(
          <ProfileHoverCard profile={profiles[handle_to_test_index]}>
            <Link
              href={`/u/${existing_profiles[handle_to_test_index]}`}
              className="text-sky-600"
            >
              @{existing_profiles[handle_to_test_index]}
            </Link>
          </ProfileHoverCard>
        )
        string_to_check = string_to_check.replace(
          "@" + existing_profiles[handle_to_test_index],
          ""
        )
        replaced = true

        break
      } else {
        handle_to_test_index++
      }
    }

    if (replaced === false) {
      react_nodes.push(<span>{string_to_check}</span>)
      break
    }
  }

  return (
    <div ref={ref} className={cn(className)} {...props}>
      {react_nodes}
    </div>
  )
})
PostDynamicBody.displayName = "PostDynamicBody"

export { PostDynamicBody }

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
          <PostDynamicBody>{post.body}</PostDynamicBody>
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
