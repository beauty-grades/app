"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { createPost } from "./actions/create-post"
import { FormSchema, InferedFormType } from "./form-schema"

export default function TextareaReactHookForm() {
  const form = useForm<InferedFormType>({
    resolver: zodResolver(FormSchema),
  })

  return (
    <Form {...form}>
      <form
        action={async (data: FormData) => {
          await createPost(data)

          toast({
            title: "Recibimos los siguientes datos:",
            description: (
              <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                <code className="text-white">
                  {JSON.stringify({ body: data.get("body") }, null, 2)}
                </code>
              </pre>
            ),
          })
        }}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nuevo post</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="¿Qué está ocurriendo?"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Pronto prodrás agregar fotos, videos y más.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Publicar</Button>
      </form>
    </Form>
  )
}
