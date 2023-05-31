import * as z from "zod"

export const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  handle: z
    .string()
    .min(2, {
      message: "Handle must be at least 2 characters.",
    })
    .max(30, {
      message: "Handle must not be longer than 30 characters.",
    }),
  bio: z.string().max(160).min(4),
  profile_picture: z.string().url().optional(),
  cover_picture: z.string().url().optional(),
})

export type ProfileFormValues = z.infer<typeof profileFormSchema>

