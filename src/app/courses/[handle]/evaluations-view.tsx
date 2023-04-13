import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs"

import Xata from "@/lib/xata"

interface Evaluation {
  handle: string
  label: string
  weight: number | null
  can_be_deleted: boolean
}

const getEvaluationsByPeriod = async (course_handle: string) => {
  const raw_evaluations = await Xata.db.evaluation
    .select(["*", "class.*", "class.course.*", "class.period.*"])
    .filter({ "class.course.handle": course_handle })
    .getAll()

  console.log(raw_evaluations)

  // group by period
  const evaluations_by_period: {
    period: string
    evaluations: Evaluation[]
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

    const period_evaluations = evaluations_by_period.find(
      (period_evaluations) => period_evaluations.period === period
    )

    if (period_evaluations) {
      period_evaluations.evaluations.push(evaluation)
    } else {
      evaluations_by_period.push({
        period,
        evaluations: [evaluation],
      })
    }
  })

  evaluations_by_period.sort(
    (a, b) =>
      parseInt(a.period.replace("-", "")) - parseInt(b.period.replace("-", ""))
  )
  return evaluations_by_period
}

interface Props {
  course_handle: string
}

export const EvaluationsView = async ({ course_handle }: Props) => {
  const evaluations_by_period = await getEvaluationsByPeriod(course_handle)

  return (
    <div>
      <Tabs
        defaultValue={evaluations_by_period[0].period}
        className="mb-4 w-full"
      >
        <TabsList>
          {evaluations_by_period.map(({ period }) => (
            <TabsTrigger key={period} value={period}>
              {period}
            </TabsTrigger>
          ))}
        </TabsList>
        {evaluations_by_period.map(({ period, evaluations }) => (
          <TabsContent key={period} value={period}>
            <View key={period} evaluations={evaluations} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

const View = ({ evaluations }: { evaluations: Evaluation[] }) => {
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
        ({ label, total_weight, can_be_deleted }) =>
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
                  style={{
                    width: `${total_weight * 100}%`,
                  }}
                  className="relative h-14 rounded-lg bg-zinc-700"
                />
              </div>
            </div>
          )
      )}
    </div>
  )
}
