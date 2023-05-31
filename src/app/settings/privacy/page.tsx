import { PrivacyForm } from "@/app/settings/privacy/privacy-form"

import { Separator } from "@/components/ui/separator"

export default function SettingsPrivacyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Privacidad</h3>
        <p className="text-sm text-muted-foreground">
          Configura tus preferencias de privacidad.
        </p>
      </div>
      <Separator />
      <PrivacyForm />
    </div>
  )
}
