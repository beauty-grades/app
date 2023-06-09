"use server";

import { zfd } from "zod-form-data";

import { getMyEmailOrThrow } from "@/lib/auth/get-my-email";
import { getMyProfile } from "@/lib/auth/get-my-profile";
import Xata from "@/lib/xata";
import { profileFormSchema } from "./profile-form-schema";

export const updateProfile = async (data: FormData) => {
  try {
    const schema = zfd.formData(profileFormSchema);

    const data_parsed = schema.parse(data);

    const profile = await getMyProfile();
    if (!profile) {
      const email = await getMyEmailOrThrow();
      const created_profile = await Xata.db.profile.create({
        ...data_parsed,
        email,
      });

      await Xata.db.profile_stats.create({
        profile: created_profile.id,
      });
    } else {
      await profile.update(data_parsed);
    }
  } catch (error) {
    return error;
  }
};
