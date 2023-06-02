// @ts-nocheck
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { follow } from "@/actions/follow"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { UploadImageButton } from "@/components/upload-image-button"
import { ProfileInteractions } from "../[handle]/profile-interactions/profile-interactions"
import {
  profileFormSchema,
  type ProfileFormValues,
} from "./profile-form-schema"
import { updateProfile } from "./update-profile"

export function ProfileForm({
  initial_values,
}: {
  initial_values: ProfileFormValues
}) {
  const router = useRouter()
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: initial_values,
    mode: "onChange",
  })

  const [profile_pic, setProfilePic] = React.useState<string>(
    initial_values.profile_picture || ""
  )

  return (
    <>
      <ProfileInteractions />
      <div className="flex flex-col items-center justify-center gap-4">
        <Avatar className="h-32 w-32">
          <AvatarImage
            src={profile_pic}
            alt={`@${initial_values.handle}'s profile picture`}
          />
          <AvatarFallback>{initial_values.name[0]}</AvatarFallback>
        </Avatar>

        <UploadImageButton
          onClientUploadComplete={(files) => {
            // Do something with the response
            files && files[0]?.fileUrl && setProfilePic(files[0].fileUrl)
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.
            alert(`ERROR! ${error.message}`)
          }}
        />
      </div>

      <Form {...form}>
        <form
          action={async (data: FormData) => {
            data.append("profile_picture", profile_pic)
            await follow()
            await updateProfile(data)
            router.push(`/@${data.get("handle")}`)
          }}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormDescription>
                  Este es el nombre que se mostrará en tu perfil.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="handle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Handle</FormLabel>
                <FormControl>
                  <Input placeholder="cuevantn" {...field} />
                </FormControl>
                <FormDescription>
                  Este es tu nombre de usuario único en la plataforma.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Cuéntanos más sobre ti..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Una breve descripción sobre ti.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button variant="outline" type="submit">
            Actualizar perfil
          </Button>
        </form>
      </Form>
    </>
  )
}
