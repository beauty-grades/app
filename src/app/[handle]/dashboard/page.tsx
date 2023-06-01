import Link from "next/link"
import { notFound } from "next/navigation"

import Xata from "@/lib/xata"
import { Separator } from "@/components/ui/separator"
import { getRanking } from "../get-ranking"
import { CoursesTable } from "./courses-table"
import { EvolutivesCharts } from "./evolutives-charts"

const Page = async ({ params }) => {
  const handle = params["handle"].replace("%40", "")

  const profile = await Xata.db.profile.filter({ handle }).getFirst()

  if (!profile) {
    notFound()
  }

  const utec_account = await Xata.db.utec_account
    .filter({ email: profile.email })
    .select(["*", "curriculum.career.*"])
    .getFirst()

  if (!utec_account) return

  const ranking = await getRanking({
    utec_account: utec_account?.id,
    career: utec_account?.curriculum?.id?.split("-")[0],
  })

  const OM_PERIOD = process.env.OM_PERIOD

  return (
    <div>
      <div className="flex h-8 items-center gap-4">
        <div className="text-xl font-bold">Promedio Histórico {utec_account.score}</div>
        <Separator orientation="vertical" />  
        {ranking && (
          <div className="text-xl font-bold">Puesto {ranking?.nums}</div>
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
