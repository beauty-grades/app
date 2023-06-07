import Link from "next/link"
import { SelectedPick } from "@xata.io/client"

import Xata from "@/lib/xata"
import { StatusRecord } from "@/lib/xata/codegen"
import { DateHoverCard } from "@/components/date-hover-card"
import { ProfileHoverCard } from "@/components/profile-list/profile-hover-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StatusActions } from "./status-actions"
import { StatusDynamicBody } from "./status-dynamic-body"

const StatusCard = async ({
  status,
}: {
  status: SelectedPick<StatusRecord, ["*", "author_profile.*"]>
}) => {
  if (!status.author_profile) return null

  const quoted_status = await Xata.db.status
    .filter({
      id: status.quote_from?.id ?? "ref_that_dont_exists",
    })
    .select(["*", "author_profile.*"])
    .getFirst()

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
              className="text-muted-foreground"
            >
              <span>@{status.author_profile.handle}</span>
            </Link>
          </ProfileHoverCard>
          {status.xata.createdAt && (
            <DateHoverCard date={status.xata.createdAt} />
          )}
        </div>
        <div className="text-muted"></div>
        <Link href={`/status/${status.id.replace("rec_", "")}`}>
          <StatusDynamicBody>{status.body}</StatusDynamicBody>
        </Link>

        {quoted_status && (
          <div className="my-2 border-l py-2 pl-4 text-muted-foreground">
            <Link href={`/status/${quoted_status.id.replace("rec_", "")}`}>
              <StatusDynamicBody>{quoted_status.body}</StatusDynamicBody>
            </Link>

            {quoted_status?.author_profile?.name && (
              <ProfileHoverCard profile={quoted_status.author_profile}>
                <Link
                  href={`/u/${status.author_profile.handle}`}
                  className="font-bold text-muted-foreground"
                >
                  {quoted_status.author_profile.name}
                </Link>
              </ProfileHoverCard>
            )}
          </div>
        )}
        <StatusActions status={status} />
      </div>
    </div>
  )
}

export { StatusCard }
