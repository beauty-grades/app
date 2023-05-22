import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"

import { getEmail } from "@/lib/utils/auth/get-email"
import Xata from "@/lib/xata"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/typography"
import { CoursesTable } from "./courses-table"
import { EvolutivesCharts } from "./evolutives-charts"

const Page = async () => {
  const cookieStore = cookies()
  const email = await getEmail(cookieStore)

  if (!email) {
    redirect("/api/auth/signin")
  }

  const utec_account = await Xata.db.utec_account.filter({ email }).getFirst()
  if (!utec_account?.id) {
    redirect("/api/auth/signin")
  }

  const nextauth_user = await Xata.db.nextauth_users
    .filter({ email })
    .getFirst()

  return (
    <>
      <div className="container">
        <Heading>{nextauth_user?.name}</Heading>
        <Heading as="h3">{utec_account?.id}</Heading>
        <Link href={`/curriculums/${utec_account.curriculum?.id}`}>
          <Heading as="h4">{utec_account?.curriculum?.id}</Heading>
        </Link>
      </div>

      {/* @ts-expect-error Async Server Component*/}
      <EvolutivesCharts utec_account={utec_account?.id} />

      {/* @ts-expect-error Async Server Component*/}
      <CoursesTable utec_account={utec_account?.id} />

      <div className="container mt-8 flex justify-center gap-4">
        <Link href="/api/auth/signout" className="text-white">
          <Button variant="destructive">Sign out</Button>
        </Link>
      </div>
    </>
  )
}

export default Page
