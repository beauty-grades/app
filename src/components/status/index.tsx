import * as React from "react"
import { SelectedPick } from "@xata.io/client"

import { StatusRecord } from "@/lib/xata/codegen"
import { Separator } from "@/components/ui/separator"
import { StatusCard } from "./status-card"

const StatusList = ({
  statuses,
}: {
  statuses: SelectedPick<StatusRecord, ["*", "author_profile.*"]>[]
}) => {
  return (
    <div className="flex flex-col">
      {statuses.map((status) => (
        <>
          <StatusCard key={status.id} status={status} />
          <Separator className="my-4" />
        </>
      ))}
    </div>
  )
}

export { StatusList }
