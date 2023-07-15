import { NextResponse } from "next/server";

import { getMyEmail } from "@/lib/auth/get-my-email";
import xata from "@/lib/xata";

export async function GET() {
  const email = await getMyEmail();

  if (!email) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const profile = await xata.db.profile.filter({ email }).getFirst();

  return NextResponse.json({ profile });
}
