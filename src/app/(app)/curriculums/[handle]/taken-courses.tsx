"use client";

import * as React from "react";
import useSWR from "swr";

export const TakenCourses = () => {
  const { data, error } = useSWR("/api/courses/taking", {
    refreshInterval: 0,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  React.useEffect(() => {
    if (error) return;
    if (!data?.ok) return;

    data.approved.forEach(({ id, name }: { id: string; name: string }) => {
      const course = document.querySelector("#course-" + id);

      if (course) {
        course.classList.add("approved-course");
      } else {
        const d_id = `[data-course-name='${name
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "")}']`;
        const course = document.querySelector(d_id);
        if (course) {
          course.classList.add("approved-course");
        } else {
          if (name.includes("Proyecto Final de ")) {
            let ddd_name = "";
            if (name.includes("II")) {
               ddd_name = "Tesis II";
            } else {
               ddd_name = "Tesis I";
            }

            const d_id = `[data-course-name='${ddd_name}']`;
            const course = document.querySelector(d_id);
            if (course) {
              course.classList.add("approved-course");
            }
          }
        }
      }
    });

    let counter = 0;
    data.taking.forEach(({ id, name }: { id: string; name: string }) => {
      const course = document.querySelector("#course-" + id);
      if (course) {
        course.classList.add("taken-course");
        //focus on the first taken course
        if (counter === 0) {
          course.scrollIntoView({ behavior: "smooth", block: "center" });
          counter++;
        }
      } else {
        const d_id = `[data-course-name='${name
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "")}']`;
        const course = document.querySelector(d_id);
        if (course) {
          course.classList.add("taken-course");
          //focus on the first taken course
          if (counter === 0) {
            course.scrollIntoView({ behavior: "smooth", block: "center" });
            counter++;
          }
        } else {
          if (name.includes("Proyecto Final de ")) {
            let ddd_name = "";
            if (name.includes("II")) {
               ddd_name = "Tesis II";
            } else {
               ddd_name = "Tesis I";
            }

            const d_id = `[data-course-name='${ddd_name}']`;
            const course = document.querySelector(d_id);
            if (course) {
              course.classList.add("taken-course");
            }
          }
        }
      }
    });

    data.elective.forEach(
      ({ id, name, taking }: { id: string; name: string; taking: boolean }) => {
        const course = document.querySelector(".elective-box");
        if (course) {
          const id_el = course.querySelector(".elective-id");
          if (id_el) {
            id_el.textContent = id;
          }

          const name_el = course.querySelector(".elective-name");
          if (name_el) {
            name_el.textContent = name;
          }

          if (taking) {
            course.classList.add("taken-course");
          } else {
            course.classList.add("approved-course");
          }

          course.classList.remove("elective-box");
        }
      }
    );
  }, [data, error]);
  return null;
};
