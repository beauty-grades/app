import * as React from "react"
import Link from "next/link"

import { ProfileRecord } from "@/lib/xata/codegen"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

const ProfileHoverCard = ({
  profile,
  children,
}: {
  profile: ProfileRecord
  children: React.ReactNode
}) => (
  <HoverCard>
    <HoverCardTrigger asChild>
      <Link href={`/u/${profile.handle}`}>{children}</Link>
    </HoverCardTrigger>
    <HoverCardContent className="w-64">
      <div>
        <Link href={`/u/${profile.handle}`}>
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile.profile_picture || ""} />
            <AvatarFallback className="font-bold">
              {profile.name
                ? profile.name.split(" ")[0][0]
                : profile.handle
                ? profile.handle[0]
                : "*"}
            </AvatarFallback>
          </Avatar>
        </Link>
        <Link href={`/u/${profile.handle}`}>
          <p className="font-bold hover:underline">{profile.name}</p>{" "}
        </Link>

        <Link href={`/u/${profile.handle}`}>
          <p className="-mt-1 mb-1 text-sm text-muted-foreground">
            @{profile.handle}
          </p>
        </Link>
        <p className="mt-2 text-sm">{profile.bio}</p>
      </div>
    </HoverCardContent>
  </HoverCard>
)

export { ProfileHoverCard }
