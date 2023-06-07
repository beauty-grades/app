import Link from "next/link"
import { SelectedPick } from "@xata.io/client"

import { StatusRecord } from "@/lib/xata/codegen"
import { DateHoverCard } from "@/components/date-hover-card"
import { ProfileHoverCard } from "@/components/profile-hover-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { StatusActions } from "./status-actions"
import { StatusDynamicBody } from "./status-dynamic-body"

const StatusCard = ({
  status,
}: {
  status: SelectedPick<StatusRecord, ["*", "author_profile.*"]>
}) => {
  if (!status.author_profile) return null

  return (
    <div className="flex gap-4">
      <ProfileHoverCard profile={status.author_profile}>
        <Link href={`/u/${status.author_profile.handle}`}>
          <Avatar className="h-14 w-14">
            <AvatarImage src={status.author_profile.profile_picture || ""} />
            <AvatarFallback className="font-bold">
              {status.author_profile.name
                ? status.author_profile.name.split(" ")[0][0]
                : status.author_profile.handle
                ? status.author_profile.handle[0]
                : "*"}
            </AvatarFallback>
          </Avatar>
        </Link>
      </ProfileHoverCard>
      <div className="flex grow flex-col">
        <div className="flex flex-wrap items-center gap-x-2">
          <ProfileHoverCard profile={status.author_profile}>
            <Link
              href={`/u/${status.author_profile.handle}`}
              className="flex gap-x-2"
            >
              <span className="font-bold hover:underline">
                {status.author_profile.name}
              </span>
            </Link>
          </ProfileHoverCard>
          <ProfileHoverCard profile={status.author_profile}>
            <Link
              href={`/u/${status.author_profile.handle}`}
              className="flex gap-x-2"
            >
              <span className="text-muted-foreground">
                @{status.author_profile.handle}
              </span>
            </Link>
          </ProfileHoverCard>
          {status.xata.createdAt && (
            <DateHoverCard date={status.xata.createdAt} />
          )}
        </div>
        <div className="text-muted"></div>
        <Link
          href={`/status/${status.id.replace("rec_", "")}`}
          className="w-full"
        >
          <StatusDynamicBody>{status.body}</StatusDynamicBody>
        </Link>

        <StatusActions />
      </div>
    </div>
  )
}

export { StatusCard }
