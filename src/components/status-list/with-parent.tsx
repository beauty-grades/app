import Link from "next/link"
import { SelectedPick } from "@xata.io/client"

import Xata from "@/lib/xata"
import { StatusRecord } from "@/lib/xata/codegen"
import { DateHoverCard } from "@/components/date-hover-card"
import { ProfileHoverCard } from "@/components/profile-list/profile-hover-card"
import { StatusActions } from "@/components/status-list/status-actions"
import { StatusDynamicBody } from "@/components/status-list/status-dynamic-body"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Props {
  replied_status_id?: string | null
  children: React.ReactNode
}

const StatusWithParent = async ({ replied_status_id, children }: Props) => {
  let replied_status: SelectedPick<
    StatusRecord,
    ["*", "author_profile.*"]
  > | null = null

  if (replied_status_id) {
    replied_status = await Xata.db.status.read(replied_status_id, [
      "*",
      "author_profile.*",
    ])
  }

  if (!replied_status?.author_profile) return <>{children}</>

  return (
    <StatusWithParent replied_status_id={replied_status.reply_to?.id}>
      <div className="flex gap-4">
        <div className="flex flex-col items-center">
          <ProfileHoverCard profile={replied_status.author_profile}>
            <Avatar className="h-14 w-14">
              <AvatarImage
                src={replied_status.author_profile.profile_picture || ""}
              />
              <AvatarFallback className="font-bold">
                {replied_status.author_profile.name
                  ? replied_status.author_profile.name.split(" ")[0][0]
                  : replied_status.author_profile.handle
                  ? replied_status.author_profile.handle[0]
                  : "*"}
              </AvatarFallback>
            </Avatar>
          </ProfileHoverCard>
          <div className="w-0.5 flex-grow bg-muted-foreground"></div>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-x-2">
            <ProfileHoverCard profile={replied_status.author_profile}>
              <span className="font-bold hover:underline">
                {replied_status.author_profile.name}
              </span>
            </ProfileHoverCard>
            <ProfileHoverCard profile={replied_status.author_profile}>
              <span>@{replied_status.author_profile.handle}</span>
            </ProfileHoverCard>
            {replied_status.xata.createdAt && (
              <DateHoverCard date={replied_status.xata.createdAt} />
            )}
          </div>
          <div className="text-muted"></div>
          <Link href={`/status/${replied_status.id.replace("rec_", "")}`}>
            <StatusDynamicBody>{replied_status.body}</StatusDynamicBody>
          </Link>
          <StatusActions status={replied_status} />
        </div>
      </div>

      {children}
    </StatusWithParent>
  )
}

export { StatusWithParent }
