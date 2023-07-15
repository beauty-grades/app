import { cache } from "react";
import { notFound } from "next/navigation";

import xata from "@/lib/xata";

export const getProfile = cache(async (handle: string | undefined | null) => {
  try {
    const profile = await xata.db.profile.filter({ handle }).getFirstOrThrow();
    return profile;
  } catch (error) {
    notFound();
  }
});
