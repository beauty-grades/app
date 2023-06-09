import * as z from "zod";

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
      message: "2 caracteres como mínimo",
    })
    .max(30, {
      message: "28 caracteres como máximo",
    })
    .regex(/^[a-zA-Z0-9._]+$/, {
      message: "Solo letras, números, . (punto) y _ (guión abajo)",
    })
    .regex(/^(?![._]).*/, {
      message: "No . (punto) ni _ (guión abajo) al inicio",
    })
    .regex(/^(?!.*[._]$).*$/, {
      message: "No . (punto) ni _ (guión abajo) al final",
    })
    .regex(/^(?!.*[_.]{2}).*$/, {
      message: "No .. ni ._ ni _. ni __",
    }),
  bio: z.string().min(4).max(160),
  profile_picture: z.string().url().optional(),
  cover_picture: z.string().url().optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
