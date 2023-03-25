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

    const raw_courses = await Xata.db.enrollment
      .select([
        "classroom.class.course",
        "classroom.class.period",
        "student.email",
      ])
      .filter({
        "student.email": email,
      })
      .getAll()

    const approved_courses: string[] = []
    const taken_courses: string[] = []

    for (const course of raw_courses) {
      if (!course.classroom?.class?.course?.handle) {
        continue
      }
      if (
        approved_courses.includes(course.classroom?.class?.course?.handle) ||
        taken_courses.includes(course.classroom?.class?.course?.handle)
      ) {
        continue
      }

      if (
        course.classroom?.class?.period?.handle === process.env.CURRENT_PERIOD
      ) {
        taken_courses.push(course.classroom?.class?.course?.handle)
      } else {
        approved_courses.push(course.classroom?.class?.course?.handle)
      }
    }

    res.status(200).json({
      taken_courses,
      approved_courses,
      ok: true,
    })
  } catch (error) {
    res.status(500).json({
      error: error.message,
    })
  }
}

export default handler
