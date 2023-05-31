import Image from "next/image"
import { notFound } from "next/navigation"

import Xata from "@/lib/xata"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heading } from "@/components/ui/typography"

const Layout = async ({ children, params }) => {
  const handle = params["handle"].replace("%40", "")

  const profile = await Xata.db.profile.filter({ handle }).getFirst()

  if (!profile) {
    notFound()
  }
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
            <AvatarFallback className="font-bold text-3xl">
              {profile.name
                ? profile.name.split(" ")[0][0] + profile.name.split(" ")[1][0]
                : profile.handle
                ? profile.handle[0]
                : "A"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      <Heading as="h3">{profile.name}</Heading>
      <p>{profile.bio}</p>
      {children}
    </div>
  )
}

export default Layout
