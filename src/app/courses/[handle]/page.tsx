import Link from "next/link"
import { Button } from "@/ui/button"
import { Heading, Paragraph } from "@/ui/typography"

import Xata from "@/lib/xata"
import { ClassroomsByPeriodGrades } from "./classrooms-grades"
import { EvaluationsView } from "./evaluations-view"

const getCourse = async (handle: string) => {
  const raw_classrooms = await Xata.db.classroom
    .select(["*", "class.*", "teacher.*", "class.course.*"])
    .filter({ "class.course.handle": handle })
    .getAll()

  const title = raw_classrooms[0]?.class?.course?.name || ""

  return title
}

const getCurriculums = async (handle: string) => {
  const raw_level_courses = await Xata.db.level_course
    .select(["*", "level.*", "course.*", "level.curriculum.*"])
    .filter({ "course.handle": handle })
    .getAll()

  const curriculums: string[] = []

  raw_level_courses.forEach((raw_level_course) => {
    if (!raw_level_course.level) return
    if (!raw_level_course.course) return
    if (!raw_level_course.level.curriculum) return

    // add the handles to the curriculum
    const curriculum = curriculums.find(
      (curriculum) => curriculum === raw_level_course.level?.curriculum?.handle
    )

    if (!curriculum) {
      const handle = raw_level_course?.level?.curriculum?.handle || ""
      curriculums.push(handle)
    }
  })

  return curriculums
}

const Page = async ({ params: { handle } }: { params: { handle: string } }) => {
  const title = await getCourse(handle)
  const curriculums = await getCurriculums(handle)

  return (
    <div className="container">
      <Heading>
        {handle} - {title}
      </Heading>

      <Heading as="h2">Periodos</Heading>
      {/* @ts-expect-error Async Server Component */}
      <EvaluationsView course_handle={handle} />

      {/* @ts-expect-error Async Server Component */}
      <ClassroomsByPeriodGrades handle={handle} />

      <Heading as="h2">Curriculums</Heading>
      <Paragraph>Este curso aparece en:</Paragraph>
      <div className="mb-4 flex flex-wrap gap-4">
        {curriculums.map((curriculum) => {
          return (
            <Link href={`/curriculums/${curriculum}`} key={curriculum}>
              <Button variant="subtle">{curriculum}</Button>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default Page
