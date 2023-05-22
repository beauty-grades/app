import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"

import { getEmail } from "@/lib/utils/auth/get-email"
import Xata from "@/lib/xata"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/typography"
import { CoursesTable } from "./courses-table"
import { EvolutivesCharts } from "./evolutives-charts"

const Page = async () => {
  const cookieStore = cookies()
  const email = await getEmail(cookieStore)

  if (!email) {
    redirect("/api/auth/signin")
  }

  const utec_account = await Xata.db.utec_account
    .filter({ email })
    .select(["*", "curriculum.career.*"])
    .getFirst()
  if (!utec_account?.id) {
    redirect("/api/auth/signin")
  }

  const nextauth_user = await Xata.db.nextauth_users
    .filter({ email })
    .getFirst()

  return (
    <div className="container">
      <Heading>{nextauth_user?.name}</Heading>
      <div className="flex items-center gap-4 mb-2">
        <span className="text-xl font-bold ">{utec_account?.id}</span>
        <Link href={`/curriculums/${utec_account.curriculum?.id}`}>
          <Button>Malla {utec_account?.curriculum?.id}</Button>
        </Link>
      </div>

      <div className="flex h-8 items-center gap-4">
        <div className="text-xl font-bold">Prom. {utec_account.score}</div>
        <Separator orientation="vertical" />
        <div className="text-xl font-bold">
          Top {utec_account.merit_order}
        </div>
      </div>

      <Separator className="my-4" />

      {/* @ts-expect-error Async Server Component*/}
      <EvolutivesCharts utec_account={utec_account?.id} />

      <Separator className="my-4" />

      {/* @ts-expect-error Async Server Component*/}
      <CoursesTable utec_account={utec_account?.id} />

      <Separator className="my-4" />

      <div className="container mt-8 flex justify-center gap-4">
        <Link href="/api/auth/signout" className="text-white">
          <Button variant="destructive">Sign out</Button>
        </Link>
      </div>
    </div>
  )
}

export default Page
