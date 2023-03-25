import { User } from "next-auth"

export type AuthUser = User & {
  id: string
  profile?: {
    id: string
    name: string
    image: string
    username: string
    bio: string
  }
}
