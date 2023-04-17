import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs"

import Xata from "@/lib/xata"

interface Classroom {
  id: string
  section: number
  score: number
  teacher: {
    id: string
    first_name: string
    last_name: string
  }
}

interface Evaluation {
  handle: string
  label: string
  weight: number | null
  can_be_deleted: boolean
}

const getEvaluationsByPeriod = async (course_handle: string) => {
  const raw_classrooms = await Xata.db.classroom
    .select(["*", "class.course.*", "teacher.*", "class.period.handle"])
    .filter({ "class.course.handle": course_handle })
    .getAll()

  const raw_evaluations = await Xata.db.evaluation
    .select(["*", "class.*", "class.course.*", "class.period.*"])
    .filter({ "class.course.handle": course_handle })
    .getAll()


  console.log(raw_evaluations)
  console.log(raw_classrooms)

  const periods: {
    period: string
    evaluations: Evaluation[]
    classrooms: Classroom[]
  }[] = []

  raw_evaluations.forEach((raw_evaluation) => {
    if (!raw_evaluation.class) return
    if (!raw_evaluation.class.course) return

    const period = raw_evaluation.class.period?.handle || ""

    const evaluation = {
      handle: raw_evaluation.handle || "",
      label: raw_evaluation.label || "",
      weight: raw_evaluation.weight || null,
      can_be_deleted: raw_evaluation.can_be_deleted,
    }

    const period_evaluations = periods.find(
      (period_evaluations) => period_evaluations.period === period
    )

    if (period_evaluations) {
      period_evaluations.evaluations.push(evaluation)
    } else {
      periods.push({
        period,
        evaluations: [evaluation],
        classrooms: []
      })
    }
  })

  raw_classrooms.forEach((raw_classroom) => {
    const classroom_period = raw_classroom.class?.period?.handle

    const existing_period = periods.find(
      ({ period }) => classroom_period === period
    )

    existing_period?.classrooms.push({
      id: raw_classroom.id,
      section: raw_classroom.section || 0,
      score: raw_classroom.score || 0,
      teacher: {
        first_name: raw_classroom.teacher?.first_name || "Unknown",
        last_name: raw_classroom.teacher?.last_name || "Teacher",
        id: raw_classroom.teacher?.id || "ukn"
      }
    })
  })

  periods.sort(
    (a, b) =>
      parseInt(a.period.replace("-", "")) - parseInt(b.period.replace("-", ""))
  )
  return periods
}

interface Props {
  course_handle: string
}

export const PeriodsView = async ({ course_handle }: Props) => {
  const periods = await getEvaluationsByPeriod(course_handle)

  return (
    <div>
      <Tabs
        className="mb-4 w-full"
      >
        <TabsList>
          {periods.map(({ period }) => (
            <TabsTrigger key={period} value={period}>
              {period}
            </TabsTrigger>
          ))}
        </TabsList>
        {periods.map(({ period, evaluations, classrooms }) => (
          <TabsContent id={`period:${period}`} key={period} value={period}>
            <Evaluations evaluations={evaluations} period={period} />
            <Classrooms classrooms={classrooms} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

const Classrooms = ({ classrooms }: { classrooms: Classroom[] }) => {
  return (
    <ul className="mt-4 border-t border-t-zinc-600 pt-4">
      {classrooms.map(
        ({ id, section, teacher, score }) => {
          return (
            <li key={id}>
              <p className="font-bold italic">Sección {section}</p>
              <p className="ml-4">
                {teacher.first_name} {teacher.last_name}
              </p>
              <p className="ml-4">{score}</p>
            </li>
          )
        }
      )}
    </ul>
  )
}

const Evaluations = ({ evaluations, period }: { evaluations: Evaluation[], period: string }) => {
  let grouped_evaluations: {
    label: string
    total_weight: number | null
    can_be_deleted: boolean
    children: {
      handle: string
      weight: number | null
    }[]
  }[] = []

  evaluations.forEach(({ handle, label, weight, can_be_deleted }) => {
    const g_e_match = grouped_evaluations.find(
      ({ label: existing_label }) => existing_label === label
    )

    if (!g_e_match) {
      grouped_evaluations.push({
        label,
        total_weight: weight,
        can_be_deleted,
        children: [
          {
            handle,
            weight,
          },
        ],
      })
    } else {
      if (weight && g_e_match?.total_weight) {
        g_e_match.total_weight += weight
      }
      g_e_match.children.push({
        handle,
        weight,
      })
    }
  })

  return (
    <div className="flex flex-col gap-4">
      {grouped_evaluations.map(
        ({ label, total_weight }) =>
          total_weight && (
            <div key={label} className="flex items-center gap-2">
              <div className="flex w-60 items-center justify-between">
                <span className="font-bold">{label}</span>
                <span className="text-zinc-600">
                  {Math.round(total_weight * 100)}%
                </span>
              </div>
              <div className="grow">
                <div
                  id={`${period}:${label}`}
                  style={{
                    width: `${total_weight * 100}%`,
                  }}
                  className="evaluation-weight relative h-14 overflow-hidden rounded-lg bg-zinc-700"
                />
              </div>
            </div>
          )
      )}

    </div>
  )
}
