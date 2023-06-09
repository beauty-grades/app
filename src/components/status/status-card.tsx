import Link from "next/link"
import { SelectedPick } from "@xata.io/client"

import { getStatus } from "@/lib/queries/get-status"
import { StatusRecord } from "@/lib/xata/codegen"
import { DateHoverCard } from "@/components/date-hover-card"
import { ProfileAvatarHoverCard } from "@/components/profile/profile-avatar"
import { ProfileHoverCard } from "@/components/profile/profile-hover-card"
import { StatusActions } from "./status-actions"
import { StatusDynamicBody } from "./status-dynamic-body"

const StatusCard = async ({
  status,
}: {
  status: SelectedPick<StatusRecord, ["*", "author_profile.*"]>
}) => {
  if (!status.author_profile) return null

  const quoted_status = await getStatus(status.quote_from?.id)

  return (
    <div className="flex gap-4">
      <ProfileAvatarHoverCard profile={status.author_profile} size="small" />
      <div className="flex grow flex-col">
        <div className="flex flex-wrap items-center gap-x-2">
          <ProfileHoverCard profile={status.author_profile}>
            <span className="font-bold hover:underline">
              {status.author_profile.name}
            </span>
          </ProfileHoverCard>
          <ProfileHoverCard profile={status.author_profile}>
            <span>@{status.author_profile.handle}</span>
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
