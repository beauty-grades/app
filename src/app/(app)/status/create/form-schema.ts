import * as z from "zod"

export const FormSchema = z.object({
  body: z
    .string()
    .min(10, {
      message: "Tus estados deben tener como mínimo 10 caracteres",
    })
    .max(280, {
      message: "Tus estados deben tener como máximo 280 caracteres",
    }),
})

export type InferedFormType = z.infer<typeof FormSchema>
