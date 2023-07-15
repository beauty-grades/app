import Link from "next/link";

import xata from "@/lib/xata";
import { GlowBox } from "@/components/ui/glow-box";
import { Heading } from "@/components/ui/typography";
import { TakenCourses } from "./taken-courses";

const getCurriculum = async (handle: string) => {
  const raw_courses = await xata.db.rel_level_course
    .select(["*", "level.*", "course.*"])
    .filter({ "level.curriculum.id": handle })
    .getAll();

  const courses_by_levels: {
    order: number;
    courses: {
      id: string;
      name: string;
      credits: number | null;
    }[];
    elective_count?: number | null;
  }[] = [];

  raw_courses.forEach((raw_course) => {
    if (!raw_course.level) return;
    if (!raw_course.course) return;
    const level = courses_by_levels.find(
      (level) => level.order === raw_course.level?.order
    );

    if (level) {
      level.courses.push({
        id: raw_course.course?.id,
        name: raw_course.course?.name || "",
        credits: raw_course.credits || null,
      });
    } else {
      courses_by_levels.push({
        order: raw_course.level?.order || 0,
        courses: [
          {
            id: raw_course.course?.id,
            name: raw_course.course?.name || "",
            credits: raw_course.credits || null,
          },
        ],
        elective_count: raw_course.level?.elective_count,
      });
    }
  });

  return courses_by_levels.sort((a, b) => a.order - b.order);
};

const Page = async ({ params: { handle } }: { params: { handle: string } }) => {
  const courses_by_levels = await getCurriculum(handle);

  return (
    <>
      <section className="">
        <Heading>{handle}</Heading>

        <ol>
          {courses_by_levels.map((level) => (
            <li key={level.order}>
              <Heading as="h3">Nivel {level.order}</Heading>
              <div className="mb-8 flex flex-wrap gap-4">
                {level.courses.map((course) => (
                  <GlowBox
                    key={course.id}
                    id={"course-" + course.id}
                    data-course-name={course.name
                      .normalize("NFD")
                      .replace(/\p{Diacritic}/gu, "")}
                    colors="group-[.approved-course]:from-green-800 group-[.approved-course]:to-yellow-800 group-[.taken-course]:from-purple-600 group-[.taken-course]:to-rose-600 from-gray-800 to-slate-800"
                  >
                    <Link
                      href={`/courses/${course.id}`}
                      className="flex h-16 w-64 flex-col justify-between"
                    >
                      <h3 className="text-left leading-5">{course.name}</h3>
                      <div className="flex items-center justify-between text-xs">
                        <span>{course.id}</span>
                        <span>{course.credits}CRD</span>
                      </div>
                    </Link>
                  </GlowBox>
                ))}
                {level.elective_count
                  ? Array(level.elective_count)
                      .fill(0)
                      .map((_, i) => (
                        <GlowBox
                          key={i}
                          colors="group-[.approved-course]:from-green-800 group-[.approved-course]:to-yellow-800 group-[.taken-course]:from-purple-600 group-[.taken-course]:to-rose-600 from-gray-800 to-slate-800"
                          className="elective-box flex flex-col justify-between"
                        >
                          <div className="flex h-16 w-64 flex-col justify-between">
                            <h3 className="elective-name text-left leading-5">
                              Electivo
                            </h3>
                            <div className="flex items-center justify-between text-xs">
                              <span className="elective-id">######</span>
                              <span>ELCT</span>
                            </div>
                          </div>
                        </GlowBox>
                      ))
                  : null}
              </div>
            </li>
          ))}
        </ol>
      </section>
      <TakenCourses />
    </>
  );
};

export default Page;
