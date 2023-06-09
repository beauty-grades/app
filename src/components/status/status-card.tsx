import Link from "next/link";
import { SelectedPick } from "@xata.io/client";

import { getStatus } from "@/lib/queries/get-status";
import { cn } from "@/lib/utils";
import { StatusRecord } from "@/lib/xata/codegen";
import { DateHoverCard } from "@/components/date-hover-card";
import { ProfileAvatarHoverCard } from "@/components/profile/profile-avatar";
import { ProfileHoverCard } from "@/components/profile/profile-hover-card";
import { StatusActions } from "./status-actions";
import { StatusDynamicBody } from "./status-dynamic-body";

const StatusCard = async ({
  status,
}: {
  status: SelectedPick<StatusRecord, ["*", "author_profile.*"]>;
}) => {
  if (!status.author_profile) return null;

  const quoted_status = await getStatus(status.quote_from?.id);

  return (
    <div>
      <div className="flex gap-4">
        <div className="flex flex-col">
          <div className="flex items-center">
            <div
              className={cn(
                "h-0.5 w-4 bg-muted",
                !quoted_status && "bg-transparent"
              )}
            ></div>
            <ProfileAvatarHoverCard profile={status.author_profile} />
          </div>
        </div>
        <div
          className={cn(
            "-mb-10 -ml-[5.5rem] mt-7 border-l-[2px] border-l-muted pb-6 pl-[5.5rem]",
            !quoted_status && "border-l-transparent"
          )}
        >
          <div className="-mt-7 flex grow flex-col">
            <div className="flex flex-wrap items-center gap-x-2">
              <ProfileHoverCard
                profile={status.author_profile}
                className="text-sm font-bold hover:underline"
              >
                {status.author_profile.name}
              </ProfileHoverCard>
              <ProfileHoverCard
                profile={status.author_profile}
                className="text-sm"
              >
                @{status.author_profile.handle}
              </ProfileHoverCard>
              {status.xata.createdAt && (
                <DateHoverCard
                  date={status.xata.createdAt}
                  className="text-sm"
                />
              )}
            </div>
            <div className="text-muted"></div>
            <Link href={`/status/${status.id.replace("rec_", "")}`}>
              <StatusDynamicBody className="pb-4">{status.body}</StatusDynamicBody>
            </Link>
          </div>
        </div>
      </div>
      {quoted_status && quoted_status.author_profile?.id && (
        <div className="mt-4 mb-2 flex space-x-4">
          <div className="flex-grow-0">
            <div className="flex items-center">
              <div className="h-0.5 w-16 bg-muted"></div>
              <ProfileAvatarHoverCard
                profile={quoted_status.author_profile}
                size="small"
              />
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-x-2">
              <ProfileHoverCard
                profile={quoted_status.author_profile}
                className="text-xs font-bold hover:underline"
              >
                {quoted_status.author_profile.name}
              </ProfileHoverCard>
              <ProfileHoverCard
                profile={quoted_status.author_profile}
                className="text-xs"
              >
                @{quoted_status.author_profile.handle}
              </ProfileHoverCard>
              {quoted_status.xata.createdAt && (
                <DateHoverCard
                  date={quoted_status.xata.createdAt}
                  className="text-xs"
                />
              )}
            </div>
            <Link href={`/status/${quoted_status.id.replace("rec_", "")}`}>
              <StatusDynamicBody>{quoted_status.body}</StatusDynamicBody>
            </Link>
          </div>
        </div>
      )}
      <StatusActions status={status} />
    </div>
  );
};

export { StatusCard };
