import Image from "next/image"
import { notFound } from "next/navigation"

import Xata from "@/lib/xata"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heading } from "@/components/ui/typography"
import { getRanking } from "./get-ranking"
import { getUtecAccount } from "./get-utec-account"
import { getProfile } from "./get-profile"

export const revalidate = 1000

export async function generateStaticParams() {
  const profiles = await Xata.db.profile.select(["handle"]).getPaginated({
    pagination: {
      size: 50,
    },
  })

  return profiles.records.map((profile) => ({
    params: {
      handle: profile.handle,
    },
  }))
}

const Layout = async ({ children, params }) => {
  const handle = params["handle"].replace("%40", "")

  const profile = await getProfile(handle)

  if (!profile) {
    notFound()
  }

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
            src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
            alt="Photo by Drew Beamer"
            fill
            className="rounded-md object-cover"
          />
        </AspectRatio>
        <div className="absolute -bottom-20 left-4">
          <Avatar className="h-40 w-40">
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
