import xata from "@/lib/xata";

export const getScoreAndRankingByPeriod = async (utec_account: string) => {
  const periods = new Map<
    string,
    {
      score: number | null;
      merit_order: number | null;
      total_students: number | null;
      ranking: number | null;
      career: string;
    }
  >();

  const careers = new Set<string>();

  const data = await xata.db.period_enrollment
    .filter({ utec_account })
    .select(["*", "utec_account.email", "curriculum.career"])
    .getAll();

  data.forEach((period_enrollment) => {
    if (period_enrollment.curriculum?.career?.id) {
      careers.add(period_enrollment.curriculum.career.id);
    }
  });

  const students_by_career_period = await xata.db.rel_career_period
    .filter({
      career: {
        id: {
          $any: Array.from(careers),
        },
      },
    })
    .select(["*", "career.*", "period.*"])
    .getAll();

  data.forEach((period_enrollment) => {
    if (
      period_enrollment.curriculum?.career?.id &&
      period_enrollment.period?.id
    ) {
      const career_period = students_by_career_period.find(
        (career_period) =>
          career_period.career?.id ===
            period_enrollment.curriculum?.career?.id &&
          career_period.period?.id === period_enrollment.period?.id
      );

      if (career_period?.career?.name) {
        periods.set(period_enrollment.period.id, {
          score: period_enrollment.score || null,
          merit_order: period_enrollment.merit_order || null,
          total_students: career_period.enrolled_students || null,
          ranking:
            period_enrollment.merit_order && career_period.enrolled_students
              ? Math.round(
                  (period_enrollment.merit_order /
                    career_period.enrolled_students) *
                    100
                )
              : null,
          career: career_period.career.name,
        });
      }
    }
  });

  return Array.from(periods).map(([period, rest]) => ({
    period,
    ...rest,
  }));
};
