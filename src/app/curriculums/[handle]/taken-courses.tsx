"use client"

import * as React from "react"
import useSWR from "swr"

export const TakenCourses = () => {
  const { data, error } = useSWR("/api/courses/taking", {
    refreshInterval: 0,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  React.useEffect(() => {
    if (error) return
    if (!data?.ok) return

    data.approved.forEach((handle: string) => {
      const course = document.querySelector("#course-" + handle)
      if (course) {
        course.classList.add("approved-course")
      }
    })

    let counter = 0
    data.taking.forEach((handle: string) => {
      const course = document.querySelector("#course-" + handle)
      if (course) {
        course.classList.add("taken-course")
        //focus on the first taken course
        if (counter === 0) {
          course.scrollIntoView({ behavior: "smooth", block: "center" })
          counter++
        }
      }
    })

    data.elective.forEach(
      ({ id, name, taking }: { id: string; name: string; taking: boolean }) => {
        const course = document.querySelector(".elective-box")
        if (course) {
          const id_el = course.querySelector(".elective-id")
          if (id_el) {
            id_el.textContent = id
          }

          const name_el = course.querySelector(".elective-name")
          if (name_el) {
            name_el.textContent = name
          }

          if (taking) {
            course.classList.add("taken-course")
          } else {
            course.classList.add("approved-course")
          }

          course.classList.remove("elective-box")
        }
      }
    )
  }, [data, error])
  return null
}
