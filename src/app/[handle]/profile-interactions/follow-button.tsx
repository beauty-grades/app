// @ts-nocheck

"use client"
import {cn} from "@/lib/utils"
import { useTransition } from "react"
import { follow } from "@/actions/follow"
import {Button} from "@/components/ui/button"
export const FollowButton = () => {
  let [isPending, startTransition] = useTransition()

  return (
    <div>
      <Button
        className="rounded-full font-bold h-8 px-6 py-0"
        onClick={() => startTransition(() => follow())}
      >
        Seguir
      </Button>
    </div>
  )
}
