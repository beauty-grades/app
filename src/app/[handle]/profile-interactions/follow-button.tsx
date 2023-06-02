// @ts-nocheck

"use client"

import { useTransition } from "react"
import { follow } from "@/actions/follow"

import { Button } from "@/components/ui/button"

export const FollowButton = () => {
  let [isPending, startTransition] = useTransition()

  return (
    <Button
      className="h-8 rounded-full px-6 py-0 font-bold"
      onClick={() => startTransition(() => follow())}
    >
      Seguir
    </Button>
  )
}
