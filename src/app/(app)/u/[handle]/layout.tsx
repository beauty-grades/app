import { Suspense } from "react";
import Image from "next/image";

import { getProfile } from "@/lib/queries/get-profile";
import xata from "@/lib/xata";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/typography";
import { getRanking } from "./get-ranking";
import { getUtecAccount } from "./get-utec-account";
import { ProfileInteractions } from "./profile-interactions";


const Layout = async ({ children, params }) => {
  const handle = params["handle"];

  const profile = await getProfile(handle);

  const utec_account = await getUtecAccount(profile.email);

  const ranking = await getRanking(
    utec_account?.id,
    utec_account?.curriculum?.id?.split("-")[0]
  );

  return (
    <>
      <div>
        <div className="relative mb-28 sm:mb-20">
          <AspectRatio ratio={3 / 1} className="bg-muted">
            <Image
              src="https://pbs.twimg.com/profile_banners/44196397/1576183471/1500x500"
              alt="Photo by Drew Beamer"
              fill
              className="rounded-md object-cover"
            />
          </AspectRatio>
          <div className="absolute -bottom-10 left-4 sm:-bottom-20">
            <Avatar className="h-20 w-20 border-2 border-background sm:h-40 sm:w-40 sm:border-4">
              <AvatarImage src={profile.profile_picture || ""} />
              <AvatarFallback className="text-lg font-bold sm:text-3xl">
                {profile.name
                  ? profile.name.split(" ")[0][0]
                  : profile.handle
                  ? profile.handle[0]
                  : "A"}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="absolute -bottom-[6.5rem] sm:-bottom-20 sm:right-4">
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
        <p className="text-sm">{profile.bio}</p>
      </div>
      <Separator className="my-4" />
      <div>{children}</div>
    </>
  );
};

export default Layout;
