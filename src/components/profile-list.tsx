import Link from "next/link"
import { Page } from "@xata.io/client"

import { ProfileRecord, RelProfilesRecord } from "@/lib/xata/codegen"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const ProfileListPaginated = ({
  profiles_page,
}: {
  profiles_page: Page<RelProfilesRecord>
}) => {
  if (profiles_page.records.length === 0) {
    return <div>Nada que ver por acá {";)"}</div>
  } else if (profiles_page.records.length > 0) {
    return (
      <div className="flex flex-col gap-4">
        {profiles_page.records.map((rel) =>
          rel?.profile_a?.handle ? (
            <ProfileCard profile={rel.profile_a} />
          ) : rel?.profile_b?.handle ? (
            <ProfileCard profile={rel.profile_b} />
          ) : null
        )}
      </div>
    )
  } else {
    return <div>Error</div>
  }
}

const ProfileCard = ({ profile }: { profile: ProfileRecord }) => {
  return (
    <Link href={`/u/${profile.handle}`}>
      <div className="flex gap-4">
        <Avatar className="h-14 w-14">
          <AvatarImage src={profile.profile_picture || ""} />
          <AvatarFallback className="font-bold">
            {profile.name
              ? profile.name.split(" ")[0][0]
              : profile.handle
              ? profile.handle[0]
              : "*"}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-bold hover:underline">{profile.name}</p>
          <p className="-mt-1 mb-1 text-sm text-muted-foreground">
            @{profile.handle}
          </p>
          <p className="text-sm">{profile.bio}</p>
        </div>
      </div>
    </Link>
  )
}
