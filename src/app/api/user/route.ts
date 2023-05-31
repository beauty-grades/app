import { NextResponse } from "next/server"

import { getEmail } from "@/lib/auth/get-email"
import Xata from "@/lib/xata"

export async function GET() {
  const email = await getEmail()

  if (!email) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 })
  }

  const profile = await Xata.db.profile.filter({ email }).getFirst()

  return NextResponse.json({ profile })
}
