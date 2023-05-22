import { NextApiRequest, NextApiResponse } from "next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { getServerSession } from "next-auth/next"

import Xata from "@/lib/xata"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getServerSession(req, res, authOptions)
    const email = session?.user?.email

    if (!email) {
      res.status(401).json({ error: "Unauthenticated" })
      return
    }

    const data = await Xata.db.section_enrollment
      .select([
        "*",
        /* @ts-ignore */
        "section.class.course.*",
        "period_enrollment.utec_account.email",
      ])
      .filter({
        "period_enrollment.utec_account.email": email,
      })
      .getAll()

    const approved = new Set<string>()
    const taking = new Set<string>()
    const elective = new Map<string, { taking: boolean; name: string }>()

    data.forEach((enrollment) => {
      if (enrollment.section?.class?.course?.name) {
        const course = enrollment.section.class.course.id
        const course_name = enrollment.section.class.course.name
        const is_elective = enrollment.elective
        const dropped_out = enrollment.dropped_out
        const score = enrollment.score || null

        if (!dropped_out) {
          if (is_elective) {
            elective.set(course, {
              name: course_name,
              taking: score === null,
            })
          } else {
            if (!score) {
              taking.add(course)
            } else {
              approved.add(course)
            }
          }
        }
      }
    })

    res.status(200).json({
      taking: Array.from(taking),
      approved: Array.from(approved),
      elective: Array.from(elective.entries()).map((e) => ({
        id: e[0],
        ...e[1],
      })),
      ok: true,
    })
  } catch (error) {
    res.status(500).json({
      error: error.message,
    })
  }
}

export default handler
