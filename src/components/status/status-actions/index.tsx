import { SelectedPick } from "@xata.io/client"

import { StatusRecord } from "@/lib/xata/codegen"
import { QuoteAction } from "./quote"
import { ReplyAction } from "./reply"

const StatusActions = ({
  status,
}: {
  status: SelectedPick<StatusRecord, ["*", "author_profile.*"]>
}) => {
  return (
    <div className="flex gap-4">
      <QuoteAction status={status} />
      <ReplyAction status={status} />
    </div>
  )
}

export { StatusActions }
