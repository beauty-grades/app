import { NextApiRequest, NextApiResponse } from "next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { getServerSession } from "next-auth/next"

import Xata from "@/lib/xata"

export interface Score {
  id: string
  handle: string
  name: string
  weight: number
  grades: number[]
  average: number
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getServerSession(req, res, authOptions)
    const email = session?.user?.email

    if (!email) {
      res.status(401).json({ error: "Unauthenticated" })
      return
    }

    const { course_handle } = req.query

    if (!course_handle) {
      res.status(400).json({ error: "Missing course handle" })
      return
    }

    const handle = course_handle as string

    const data = await Xata.db.score
      .select(["*", "evaluation.*", "evaluation.class.*"])
      .filter({ "enrollment.student.email": email })
      .filter({
        "evaluation.class.course": {
          handle,
        },
      })
      .getAll()

    let scores: Score[] = []
    data.forEach((score) => {
      if (score.evaluation) {
        const grades = score.raw_grades.split(",").map((grade) => {
          return parseFloat(grade)
        })
        scores.push({
          id: score.id,
          handle: score.evaluation.handle,
          name: score.evaluation.name,
          weight: score.evaluation.weight,
          grades,
          average: grades.reduce((a, b) => a + b) / grades.length,
        })
      }
    })

    res.status(200).json({
      scores,
      ok: true,
    })
  } catch (error) {
    res.status(500).json({
      error: error.message,
    })
  }
}

export default handler
