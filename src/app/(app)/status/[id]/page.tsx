import Link from "next/link"
import { SelectedPick } from "@xata.io/client"

import Xata from "@/lib/xata"
import { StatusRecord } from "@/lib/xata/codegen"
import { StatusList } from "@/components/status-list"
import { StatusDynamicBody } from "@/components/status-list/status-dynamic-body"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

const StatusPage = async ({ params }: { params: { id: string } }) => {
  const status_id = "rec_" + params.id

  const status = await Xata.db.status.read(status_id, ["*", "author_profile.*"])

  if (!status?.author_profile || !status.embedding) return null

  const raw_similar_statuses = await Xata.db.status.vectorSearch(
    "embedding",
    status.embedding,
    {
      size: 11,
    }
  )

  const still_raw_similar_statuses = await Promise.all(
    raw_similar_statuses.map(async ({ id }) => {
      if (id !== status_id) {
        const status = await Xata.db.status.read(id, ["*", "author_profile.*"])
        if (status) {
          return { ...status, xata: status.xata } as SelectedPick<
            StatusRecord,
            ["author_profile.*", "*"]
          >
        }
      }
    })
  )

  const similar_statuses = still_raw_similar_statuses.filter(
    (el) => el !== undefined
  ) as SelectedPick<StatusRecord, ["author_profile.*", "*"]>[]

  return (
    <div>
      <div className="flex gap-4">
        <Link href={`/u/${status.author_profile.handle}`}>
          <Avatar className="h-14 w-14">
            <AvatarImage src={status.author_profile.profile_picture || ""} />
            <AvatarFallback className="font-bold">
              {status.author_profile.name
                ? status.author_profile.name.split(" ")[0][0]
                : status.author_profile.handle
                ? status.author_profile.handle[0]
                : "*"}
            </AvatarFallback>
          </Avatar>
        </Link>
        <Link href={`/u/${status.author_profile.handle}`}>
          <p className="font-bold">{status.author_profile.name}</p>
          <p className="-mt-1 mb-1 text-sm text-muted-foreground">
            @{status.author_profile.handle}
          </p>
        </Link>
      </div>

      <StatusDynamicBody className="text-lg">{status.body}</StatusDynamicBody>

      <Separator className="my-4" />

      <div className="">
        <h2>Publicaciones similares</h2>
        <StatusList statuses={similar_statuses} />
      </div>
    </div>
  )
}

export default StatusPage
