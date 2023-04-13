import { NextApiRequest, NextApiResponse } from "next"

import { parseEvaluations } from "./parse-evaluations"
import { TESTS } from "./raw-grades"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const tested: {
      course: string
      teacher: string
      formula: string
      evaluations: {
        handle: string
        label: string
        weight: number | null
        can_be_deleted: boolean
        score: number | null
      }[]
    }[] = []

    Object.values(TESTS).map((test_group) => {
      Object.values(test_group).forEach((test) => {
        const { formula, scores, idCourse, teacher } = test
        const { evaluations, wrong_formula } = parseEvaluations(scores, formula)

        tested.push({
          formula,
          evaluations,
          course: idCourse,
          teacher,
        })
      })
    })

    res.status(200).json({ message: "OK", tested })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}

export default handler
