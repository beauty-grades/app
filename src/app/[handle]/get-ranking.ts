import { cache } from "react"

import Xata from "@/lib/xata"

export const getRanking = cache(
  async (utec_account: string | undefined, career: string | undefined) => {
    try {
      let ranking: string | null = null

      const MO_PERIOD = process.env.MO_PERIOD as string
      const rel_career_period = await Xata.db.rel_career_period.read(
        `${career}-${MO_PERIOD}`
      )

      const period_enrollment = await Xata.db.period_enrollment.read(
        `${MO_PERIOD}-${utec_account}`
      )

      if (
        rel_career_period?.enrolled_students &&
        period_enrollment?.merit_order
      ) {
        const mo =
          period_enrollment.merit_order / rel_career_period.enrolled_students

        if (mo <= 1 / 10) {
          ranking = "Décimo superior"
        } else if (mo <= 1 / 5) {
          ranking = "Quinto superior"
        } else if (mo <= 1 / 3) {
          ranking = "Tercio superior"
        }

        return {
          label: ranking ? `${ranking} (${MO_PERIOD})` : null,
          nums: `${period_enrollment.merit_order} / ${rel_career_period.enrolled_students} (${MO_PERIOD})`,
        }
      } else {
        throw new Error("No se encontró el ranking")
      }
    } catch (error) {
      return null
    }
  }
)
