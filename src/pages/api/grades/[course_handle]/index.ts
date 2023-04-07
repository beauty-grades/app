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
  delete_lowest: boolean
  average: number
}

export interface Enrollment {
  period: string
  scores: Score[]
  teacher: {
    id: string
    fist_name: string
    last_name: string
  }
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
      .select([
        "*",
        "evaluation.*",
        "evaluation.class.*",
        "evaluation.class.period",
        "enrollment.classroom.*",
        "enrollment.classroom.teacher",
      ])
      .filter({ "enrollment.student.email": email })
      .filter({
        "evaluation.class.course": {
          handle,
        },
      })
      .getAll()

    let enrollments: Enrollment[] = []

    data.forEach((score) => {
      if (
        score.evaluation?.class?.period &&
        score.enrollment?.classroom?.teacher
      ) {
        const period = score.evaluation.class.period.handle
        const teacher = score.enrollment.classroom.teacher

        const existing = enrollments.find(
          (enrollment) => enrollment.period === period
        )

        const grades = score.raw_grades.split(",").map((grade) => {
          return parseFloat(grade)
        })
        const delete_lowest = score.evaluation.delete_lowest

        let average = grades.reduce((a, b) => a + b)
        if (delete_lowest) {
          average -= Math.min(...grades)
        }
        average /= grades.length - (delete_lowest ? 1 : 0)

        if (existing) {
          existing.scores.push({
            id: score.id,
            handle: score.evaluation.handle,
            name: score.evaluation.name,
            weight: score.evaluation.weight,
            delete_lowest: score.evaluation.delete_lowest,
            grades,
            average: average,
          })
        } else {
          enrollments.push({
            period: score.evaluation.class.period.handle as string,
            teacher: {
              id: teacher.id,
              fist_name: teacher.first_name,
              last_name: teacher.last_name,
            },
            scores: [
              {
                id: score.id,
                handle: score.evaluation.handle,
                name: score.evaluation.name,
                weight: score.evaluation.weight,
                delete_lowest: score.evaluation.delete_lowest,
                grades,
                average: average,
              },
            ],
          })
        }
      }
    })

    if (enrollments.length === 0) {
      const data = await Xata.db.enrollment
        .select([
          "*",
          "classroom.*",
          "student.*",
          "classroom.class.*",
          "classroom.class.period",
          "classroom.teacher.*",
          "classroom.class.course",
        ])
        .filter({ "student.email": email })
        .filter({
          "classroom.class.course": {
            handle,
          },
        })
        .getAll()

      // find evaluations for each class
      data.forEach(async (enrollment) => {
        if (!enrollment.classroom?.class?.id) {
          return
        }

        const period = enrollment.classroom.class.period?.handle
        const teacher = enrollment.classroom.teacher

        const evaluations = await Xata.db.evaluation
          .select(["*"])
          .filter({
            class: {
              id: enrollment.classroom.class.id,
            },
          })
          .getAll()

        if (period && teacher && evaluations) {
          enrollments.push({
            period: period as string,
            teacher: {
              id: teacher.id,
              fist_name: teacher.first_name,
              last_name: teacher.last_name,
            },
            scores: evaluations.map((evaluation) => {
              return {
                id: "",
                handle: evaluation.handle,
                name: evaluation.name,
                weight: evaluation.weight,
                delete_lowest: evaluation.delete_lowest,
                grades: [],
                average: 0,
              }
            }),
          })
        }
      })
    }

    res.status(200).json({
      enrollments,
      ok: true,
    })
  } catch (error) {
    res.status(500).json({
      error: error.message,
    })
  }
}

export default handler
