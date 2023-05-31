import { redirect } from "next/navigation"
import { ProfileForm } from "@/app/settings/profile-form"

import { getEmail } from "@/lib/auth/get-email"
import Xata from "@/lib/xata"
import { Separator } from "@/components/ui/separator"
import { ProfileFormValues } from "./profile-form-schema"

export default async function SettingsProfilePage() {
  const email = await getEmail()

  if (!email) {
    redirect("/api/auth/signin")
  }

  const profile = await Xata.db.profile.filter({ email }).getFirst()
  if (!profile?.id) {
    redirect("/api/auth/signin")
  }

  const initial_values: ProfileFormValues = {
    name: profile.name || "",
    handle: profile.handle || "",
    bio: profile.bio || "",
    profile_picture: profile.profile_picture || "",
    cover_picture: profile.cover_picture || "",
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Perfil</h3>
        <p className="text-sm text-muted-foreground">
          Actualiza tu información personal.
        </p>
      </div>
      <Separator />
      <ProfileForm initial_values={initial_values} />
    </div>
  )
}
