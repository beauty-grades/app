import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Button } from "@/ui/button"
import { Heading } from "@/ui/typography"

import { getEmail } from "@/lib/utils/auth/get-email"
import Xata from "@/lib/xata"

const getCurriculums = async (email: string) => {
  const student_curriculums = await Xata.db.student_curriculum
    .select(["*", "curriculum.*", "student.email"])
    .filter({
      "student.email": email,
    })
    .getAll()

  return student_curriculums.map(
    (student_curriculum) => student_curriculum.curriculum?.handle
  )
}

const Page = async () => {
  const cookieStore = cookies()
  const email = await getEmail(cookieStore)

  if (!email) {
    redirect("/api/auth/signin")
  }

  const curriculums = await getCurriculums(email)

  return (
    <>
      <div className="container">
        <Heading>Dashboard</Heading>

        <Heading as="h3">Estás matrículado en:</Heading>
        <div className="flex flex-wrap gap-4">
          {curriculums.map((curriculum) => {
            return (
              <Link href={`/curriculums/${curriculum}`}>
                <Button variant="subtle" key={curriculum}>
                  {curriculum}
                </Button>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="container mt-8 flex justify-center gap-4">
        <Link href="/dashboard/feed">
          <Button variant="subtle">Feed</Button>
        </Link>
        <Link href="/api/auth/signout" className="text-white">
          <Button variant="destructive">Sign out</Button>
        </Link>
      </div>
    </>
  )
}

export default Page
