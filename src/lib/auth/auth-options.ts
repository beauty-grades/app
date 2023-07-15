import { XataAdapter } from "@next-auth/xata-adapter";
import GoogleProvider from "next-auth/providers/google";

import xata from "@/lib/xata";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  adapter: XataAdapter(xata),
};
