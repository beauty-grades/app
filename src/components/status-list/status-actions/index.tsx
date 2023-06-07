import { SelectedPick } from "@xata.io/client"

import { StatusRecord } from "@/lib/xata/codegen"
import { QuoteAction } from "./quote"

const StatusActions = ({
  status,
}: {
  status: SelectedPick<StatusRecord, ["*", "author_profile.*"]>
}) => {
  return (
    <div className="flex gap-4">
      <QuoteAction status={status} />
    </div>
  )
}

export { StatusActions }
