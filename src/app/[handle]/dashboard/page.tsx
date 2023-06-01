import { notFound } from "next/navigation"

import { Separator } from "@/components/ui/separator"
import { getProfile } from "../get-profile"
import { getRanking } from "../get-ranking"
import { getUtecAccount } from "../get-utec-account"
import { CoursesTable } from "./courses-table"
import { EvolutivesCharts } from "./evolutives-charts"

export const revalidate = 1000000

const Page = async ({ params }) => {
  const handle = params["handle"].replace("%40", "")

  const profile = await getProfile(handle)

  if (!profile) {
    notFound()
  }

  const utec_account = await getUtecAccount(profile.email)

  if (!utec_account) return

  const ranking = await getRanking(
    utec_account?.id,
    utec_account?.curriculum?.id?.split("-")[0]
  )

  return (
    <div>
      <div className="flex h-8 items-center gap-4">
        <div className="text-xl font-bold">
          Promedio Histórico {utec_account.score}
        </div>
        {ranking && (
          <>
            <Separator orientation="vertical" />
            <div className="text-xl font-bold">Puesto {ranking?.nums}</div>
          </>
        )}
      </div>

      <Separator className="my-4" />

      {/* @ts-expect-error Async Server Component*/}
      <EvolutivesCharts utec_account={utec_account?.id} />

      <Separator className="my-4" />

      {/* @ts-expect-error Async Server Component*/}
      <CoursesTable utec_account={utec_account?.id} />
    </div>
  )
}

export default Page
