import { cache } from "react"

import Xata from "@/lib/xata"

interface Args {
  utec_account?: string
  career?: string
}

export const getRanking = cache(async ({ utec_account, career }: Args) => {
  try {
    let ranking: string | null = null

    const OM_PERIOD = process.env.OM_PERIOD as string
    const rel_career_period = await Xata.db.rel_career_period.read(
      `${career}-${OM_PERIOD}`
    )

    const period_enrollment = await Xata.db.period_enrollment.read(
      `${OM_PERIOD}-${utec_account}`
    )

    if (
      rel_career_period?.enrolled_students &&
      period_enrollment?.merit_order
    ) {
      const om =
        period_enrollment.merit_order / rel_career_period.enrolled_students

      if (om <= 1 / 10) {
        ranking = "Décimo superior"
      } else if (om <= 1 / 5) {
        ranking = "Quinto superior"
      } else if (om <= 1 / 3) {
        ranking = "Tercio superior"
      }

      return {
        label: ranking ? `${ranking} (${OM_PERIOD})` : null,
        nums: `${period_enrollment.merit_order} / ${rel_career_period.enrolled_students} (${OM_PERIOD})`,
      }
    } else {
      throw new Error("No se encontró el ranking")
    }
  } catch (error) {
    return null
  }
})
