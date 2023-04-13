import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/ui/accordion"
import { Heading } from "@/ui/typography"

import Xata from "@/lib/xata"
import { LineChartGrades } from "./linechart-grades"

const getScoresByClassrooms = async (handle: string) => {
  const raw_classrooms = await Xata.db.classroom
    .select([
      "*",
      "class.*",
      "teacher.*",
      "class.course.handle",
      "class.period.*",
    ])
    .filter({ "class.course.handle": handle })
    .getAll()

  const classrooms_by_period: {
    period: string
    average: number | null
    classrooms: {
      id: string
      section: number
      teacher: {
        id: string
        first_name: string
        last_name: string
      }
      score: number | null
    }[]
  }[] = []

  raw_classrooms.forEach((raw_classroom) => {
    if (!raw_classroom.class) return
    if (!raw_classroom.class.period?.handle) return

    const period = raw_classroom.class.period.handle

    const classroom_by_period = classrooms_by_period.find(
      (classroom_by_period) => classroom_by_period.period === period
    )

    const parsed_classroom = {
      id: raw_classroom.id,
      section: raw_classroom.section || -1,
      teacher: {
        id: raw_classroom.teacher?.id || "unknown",
        first_name: raw_classroom.teacher?.first_name || "Un",
        last_name: raw_classroom.teacher?.last_name || "Known",
      },
      score: raw_classroom.score || null,
    }

    if (!classroom_by_period) {
      classrooms_by_period.push({
        period,
        classrooms: [parsed_classroom],
        average: parsed_classroom.score || null,
      })
    } else {
      classroom_by_period.classrooms.push(parsed_classroom)
      classroom_by_period.average =
        classroom_by_period.classrooms.reduce(
          (acc, classroom) => (classroom.score ? acc + classroom.score : acc),
          0
        ) / classroom_by_period.classrooms.length
    }
  })

  // sort by period: 2019-1, 2019-2, 2020-1, 2020-2...
  classrooms_by_period.sort((a, b) => {
    const a_year = parseInt(a.period.split("-")[0])
    const b_year = parseInt(b.period.split("-")[0])

    const a_semester = parseInt(a.period.split("-")[1])
    const b_semester = parseInt(b.period.split("-")[1])

    if (a_year > b_year) return 1
    if (a_year < b_year) return -1

    if (a_semester > b_semester) return 1
    if (a_semester < b_semester) return -1

    return 0
  })

  return classrooms_by_period
}

export const ClassroomsByPeriodGrades = async ({
  handle,
}: {
  handle: string
}) => {
  const classrooms_by_period = await getScoresByClassrooms(handle)
  return (
    <div className="my-4">
      <Heading as="h2">Notas generales</Heading>

      {classrooms_by_period.length > 1 && (
        <LineChartGrades
          data={classrooms_by_period.map((classroom) => ({
            Periodo: classroom.period,
            Promedio: classroom.average,
          }))}
        />
      )}

      <Accordion type="single" collapsible>
        {classrooms_by_period.map((classroom) => {
          return (
            <AccordionItem key={classroom.period} value={classroom.period}>
              <AccordionTrigger>{classroom.period}</AccordionTrigger>
              <AccordionContent>
                <span className="font-xs text-zinc-400">
                  Promedio: {classroom.average}
                </span>
                <ul>
                  {classroom.classrooms.map(
                    ({ id, section, teacher, score }) => {
                      return (
                        <li key={id}>
                          <p className="font-bold italic">Sección {section}</p>
                          <p className="ml-2">
                            {teacher.first_name} {teacher.last_name}
                          </p>
                          <p className="ml-2">{score}</p>
                        </li>
                      )
                    }
                  )}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}