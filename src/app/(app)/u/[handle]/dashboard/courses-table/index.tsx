import Xata from "@/lib/xata"
import { Heading } from "@/components/ui/typography"
import { columns, Course } from "./columns"
import { DataTable } from "./data-table"

async function getData(utec_account: string): Promise<Course[]> {
  const section_enrollments = await Xata.db.section_enrollment
    .filter({
      "period_enrollment.utec_account": utec_account,
    })
    .select([
      "*",
      "section.*",
      "section.teacher.*",
      "section.class.*",
      /* @ts-ignore */
      "section.class.course.*",
      "period_enrollment.*",
      "period_enrollment.period.*",
      "period_enrollment.utec_account.*",
    ])
    .getAll()

  const courses: Course[] = []

  section_enrollments.forEach((section_enrollment) => {
    if (
      section_enrollment?.section?.section &&
      section_enrollment?.section?.class?.course?.name &&
      section_enrollment?.period_enrollment?.period?.id
    ) {
      courses.push({
        id: section_enrollment.section.class.course.id,
        name: section_enrollment.section.class.course.name,
        period: section_enrollment.period_enrollment.period.id,
        score: section_enrollment.score || null,
        section: section_enrollment.section?.section,
        section_score: section_enrollment.section?.score || null,
        dropped_out: section_enrollment.dropped_out,
        is_elective: section_enrollment.elective,
        teacher: section_enrollment.section.teacher?.name || null,
      })
    }
  })

  return courses
}

export const CoursesTable = async ({
  utec_account,
}: {
  utec_account: string
}) => {
  const data = await getData(utec_account)

  return (
    <>
      <Heading as="h2">Cursos matriculados</Heading>

      <DataTable columns={columns} data={data} />
    </>
  )
}
