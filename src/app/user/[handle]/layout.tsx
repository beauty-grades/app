import { Suspense } from "react"
import Image from "next/image"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heading } from "@/components/ui/typography"
import { getProfile } from "./get-profile"
import { getRanking } from "./get-ranking"
import { getUtecAccount } from "./get-utec-account"
import { ProfileInteractions } from "./profile-interactions"

export const revalidate = 10000

const Layout = async ({ children, params }) => {
  const handle = params["handle"]

  const profile = await getProfile(handle)

  const utec_account = await getUtecAccount(profile.email)

  const ranking = await getRanking(
    utec_account?.id,
    utec_account?.curriculum?.id?.split("-")[0]
  )

  return (
    <div className="container">
      <div className="relative mb-20">
        <AspectRatio ratio={3 / 1} className="bg-muted">
          <Image
            src="https://pbs.twimg.com/profile_banners/44196397/1576183471/1500x500"
            alt="Photo by Drew Beamer"
            fill
            className="rounded-md object-cover"
          />
        </AspectRatio>
        <div className="absolute -bottom-20 left-4">
          <Avatar className="h-40 w-40 border-4 border-white">
            <AvatarImage src={profile.profile_picture || ""} />
            <AvatarFallback className="text-3xl font-bold">
              {profile.name
                ? profile.name.split(" ")[0][0]
                : profile.handle
                ? profile.handle[0]
                : "A"}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="absolute right-4">
          <Suspense>
            {/* @ts-ignore */}
            <ProfileInteractions profile_id={profile.id} handle={handle} />
          </Suspense>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold">{profile.name}</h1>
        {ranking?.label && <Badge>{ranking?.label}</Badge>}
      </div>
      <Heading as="h4" className="text-md -mt-2 font-medium">
        @{profile.handle}
      </Heading>
      <p>{profile.bio}</p>
      {children}
    </div>
  )
}

export default Layout
