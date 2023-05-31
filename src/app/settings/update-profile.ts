"use server"

import { zfd } from "zod-form-data"

import { getEmail } from "@/lib/auth/get-email"
import Xata from "@/lib/xata"
import { profileFormSchema } from "./profile-form-schema"

export const updateProfile = async (data: FormData) => {
  try {
    const schema = zfd.formData(profileFormSchema)

    const data_parsed = schema.parse(data)

    const email = await getEmail()

    if (!email) {
      throw new Error("No email found")
    }

    const profile = await Xata.db.profile.filter({ email }).getFirst()
    if (!profile) {
      await Xata.db.profile.create({
        ...data_parsed,
        email,
      })
    } else {
      await profile.update(data_parsed)
    }

  } catch (error) {
    console.log(error)
    return error
  }
}
