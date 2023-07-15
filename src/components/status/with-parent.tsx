import Link from "next/link";

import { getStatus } from "@/lib/queries/get-status";
import { DateHoverCard } from "@/components/date-hover-card";
import { ProfileAvatarHoverCard } from "@/components/profile/profile-avatar";
import { ProfileHoverCard } from "@/components/profile/profile-hover-card";
import { StatusActions } from "@/components/status/status-actions";
import { StatusDynamicBody } from "@/components/status/status-dynamic-body";

interface Props {
  replied_status_id?: string | null;
  children: React.ReactNode;
}

const StatusWithParent = async ({ replied_status_id, children }: Props) => {
  const replied_status = await getStatus(replied_status_id);

  if (!replied_status?.id || !replied_status?.author_profile)
    return <>{children}</>;

  return (
    <StatusWithParent replied_status_id={replied_status.reply_to?.id}>
      <div className="flex gap-4">
        <div className="flex flex-col items-center">
          <ProfileAvatarHoverCard profile={replied_status.author_profile} />
          <div className="w-0.5 grow bg-muted-foreground"></div>
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
  );
};

export { StatusWithParent };
