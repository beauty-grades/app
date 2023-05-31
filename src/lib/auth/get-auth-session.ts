import { getServerSession } from "next-auth/next"

import { authOptions } from "@/lib/auth/auth-options"

export const getAuthSession = async () => {
  const session = await getServerSession(authOptions)

  return session
}
