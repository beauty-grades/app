import { NextApiRequest, NextApiResponse } from "next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { getServerSession } from "next-auth/next"

import Xata from "@/lib/xata"

interface Grade {
  handle: string | null
  label: string
  score: number | null
  weight: number
}

interface Enrollment {
  period: string
  section: number
  dropped_out: boolean
  grades: Grade[]
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

    const raw_enrollments = await Xata.db.enrollment
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

    // we need to know in wich periods the student is enrolled
    const enrollments: (Enrollment | null)[] = await Promise.all(
      raw_enrollments.map(async (raw_enrollment) => {
        try {
          if (!raw_enrollment.classroom?.class?.period?.handle) {
            return null
          }

          const period = raw_enrollment.classroom.class.period.handle
          const section = raw_enrollment.classroom.section || 0
          const dropped_out = raw_enrollment.dropped_out

          const current_period = process.env.CURRENT_PERIOD as string
          let grades: Grade[] = []

          if (period !== current_period && !dropped_out) {
            const raw_grades = await Xata.db.grade
              .select(["*", "evaluation.*"])
              .filter({
                "enrollment.id": raw_enrollment.id,
              })
              .getAll()

            raw_grades.forEach((grade) => {
              if (grade.evaluation?.handle) {
                grades.push({
                  handle: grade.evaluation?.handle || null,
                  label: grade.evaluation?.label || "",
                  score: grade.score || null,
                  weight: grade.evaluation?.weight || 0
                })
              }
            })
          }

          return {
            period,
            section,
            dropped_out,
            grades,
          }
        } catch {
          return null
        }
      })
    )

    res.status(200).json(enrollments)
  } catch (error) {
    res.status(500).json({
      error: error.message,
    })
  }
}

export default handler
