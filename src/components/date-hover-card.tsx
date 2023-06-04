import { CalendarDays } from "lucide-react"

import { getRelativeTimeString } from "@/lib/utils"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

export function DateHoverCard({ date }: { date: Date }) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span className="h-max p-0 font-light text-muted-foreground hover:cursor-pointer">
          {getRelativeTimeString(date)}
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-max px-1 py-0.5">
        <div className="flex items-center gap-1">
          <CalendarDays className="h-4 w-4" />
          <span className="text-xs">{date.toLocaleString()}</span>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
