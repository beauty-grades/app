import Link from "next/link"

import { ProfileRecord } from "@/lib/xata/codegen"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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

export { ProfileCard }
