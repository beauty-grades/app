import { NextResponse } from "next/server";

import { getMyEmail } from "@/lib/auth/get-my-email";
import xata from "@/lib/xata";


export async function GET() {
  try {
    const email = await getMyEmail();

    if (!email) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const data = await xata.db.section_enrollment
      .select([
        "*",
        /* @ts-ignore */
        "section.class.course.*",
        "period_enrollment.utec_account.email",
      ])
      .filter({
        "period_enrollment.utec_account.email": email,
      })
      .getAll();

    const approved = new Set<{ id: string; name: string }>();
    const taking = new Set<{ id: string; name: string }>();
    const elective = new Map<string, { taking: boolean; name: string }>();

    data.forEach((enrollment) => {
      if (enrollment.section?.class?.course?.name) {
        const course = enrollment.section.class.course.id;
        const course_name = enrollment.section.class.course.name;
        const is_elective = enrollment.elective;
        const dropped_out = enrollment.dropped_out;
        const score = enrollment.score || null;

        if (!dropped_out) {
          if (is_elective) {
            elective.set(course, {
              name: course_name,
              taking: score === null,
            });
          } else {
            if (!score) {
              taking.add({ id: course, name: course_name });
            } else {
              approved.add({ id: course, name: course_name });
            }
          }
        }
      }
    });

    return NextResponse.json({
      taking: Array.from(taking),
      approved: Array.from(approved),
      elective: Array.from(elective.entries()).map((e) => ({
        id: e[0],
        ...e[1],
      })),
      ok: true,
    });
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
