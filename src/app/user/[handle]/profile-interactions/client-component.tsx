"use client"

import { experimental_useOptimistic as useOptimistic } from "react"

import { Button } from "@/components/ui/button"
import { follow } from "./actions/follow"
import { unfollow } from "./actions/unfollow"

interface ProfileInteractionsProps {
  profile_id: string
  initial_following: boolean
  initial_follower_count: number
  initial_following_count: number
}

interface Status {
  following: boolean
  follower_count: number
  server_working: boolean
}

export const ProfileInteractionsClient = ({
  profile_id,
  initial_following,
  initial_follower_count,
  initial_following_count,
}: ProfileInteractionsProps) => {
  const [optimisticStatus, updateOptimisticStatus] = useOptimistic<
    Status,
    "follow" | "unfollow"
  >(
    {
      following: initial_following,
      follower_count: initial_follower_count,
      server_working: false,
    },
    (state, action) => ({
      ...state,
      following: !state.following,
      follower_count: state.follower_count + (action === "follow" ? 1 : -1),
      server_working: true,
    })
  )

  const custom_style = optimisticStatus.following
    ? "after:content-['Siguiendo'] hover:border-red-300 hover:bg-red-100 hover:text-red-600 hover:after:content-['Dejar_de_seguir']"
    : "after:content-['Seguir']"

  return (
    <div className="flex h-20 items-center gap-4">
      <div className="flex gap-2">
        <p>{initial_following_count} Siguiendo</p>
        <p>{optimisticStatus.follower_count} Seguidores</p>
      </div>

      <form
        action={async () => {
          if (!optimisticStatus.server_working) {
            const _action = optimisticStatus.following ? "unfollow" : "follow"
            updateOptimisticStatus(_action)
            if (_action === "unfollow") {
              await unfollow(profile_id)
            } else {
              await follow(profile_id)
            }
          }
        }}
      >
        <Button
          type="submit"
          variant={optimisticStatus.following ? "outline" : "default"}
          className={
            "h-8 rounded-full px-6 py-0 font-bold" + " " + custom_style
          }
        />
      </form>
    </div>
  )
}
