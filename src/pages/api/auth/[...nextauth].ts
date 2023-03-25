import { XataAdapter } from "@next-auth/xata-adapter"
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

import Xata from "@/lib/xata"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  adapter: XataAdapter(Xata),
}

export default NextAuth(authOptions)
