import { cache } from "react";
import { redirect } from "next/navigation";

import Xata from "@/lib/xata";
import { getMyEmailOrThrow } from "./get-my-email";

export const getMyProfileOrThrow = cache(async () => {
  const email = await getMyEmailOrThrow();
  const profile = await Xata.db.profile.filter({ email }).getFirstOrThrow();
  return profile;
});

export const getMyProfileOrConfigure = cache(async () => {
  try {
    const profile = await getMyProfileOrThrow();
    return profile;
  } catch (error) {
    redirect("/settings");
  }
});

export const getMyProfile = cache(async () => {
  try {
    const profile = await getMyProfileOrThrow();
    return profile;
  } catch (error) {
    return null;
  }
});
