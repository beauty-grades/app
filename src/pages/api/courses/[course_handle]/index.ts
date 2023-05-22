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
  status: "enrolled" | "dropped_out" | "failed" | "passed"
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

    const raw_enrollments = await Xata.db.section_enrollment
      .select([
        "*",
        "section.*",
        "period_enrollment.utec_account.*",
        "section.class.*",
        "section.class.period",
        "section.teacher.*",
        "section.class.course",
      ])
      .filter({ "period_enrollment.utec_account.email": email })
      .filter({
        "section.class.course": handle,
      })
      .getAll()

    // we need to know in wich periods the utec_account is enrolled
    const enrollments: (Enrollment | null)[] = await Promise.all(
      raw_enrollments.map(async (raw_enrollment) => {
        try {
          if (!raw_enrollment.section?.class?.period?.id) {
            return null
          }

          const period = raw_enrollment.section.class.period.id
          const section = raw_enrollment.section.section || 0

          let status: Enrollment["status"] = "passed"

          if (raw_enrollment.dropped_out) {
            status = "dropped_out"
          } else if (raw_enrollment.score === null) {
            status = "enrolled"
          } else if (raw_enrollment?.score && raw_enrollment.score < 11) {
            status = "failed"
          }

          let grades: Grade[] = []

          if (!raw_enrollment.dropped_out) {
            const raw_grades = await Xata.db.grade
              .select(["*", "evaluation.*"])
              .filter({
                "section_enrollment.id": raw_enrollment.id,
              })
              .getAll()

            raw_grades.forEach((grade) => {
              if (grade.evaluation?.handle) {
                grades.push({
                  handle: grade.evaluation?.handle || null,
                  label: grade.evaluation?.label || "",
                  score: grade.score || null,
                  weight: grade.evaluation?.weight || 0,
                })
              }
            })
          }

          return {
            period,
            section,
            status,
            grades,
            final_score: raw_enrollment.score || null,
          } as Enrollment
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
