"use client"

import React from "react"
import useSWR from "swr"

export const TakenCourses = () => {
  const { data, error } = useSWR("/api/courses/taken")

  React.useEffect(() => {
    if (error) return
    if (!data?.ok) return

    data.approved_courses.forEach((handle: string) => {
      const course = document.querySelector("#course-" + handle)
      if (course) {
        course.classList.add("approved-course")
      }
    })

    let counter = 0
    data.taken_courses.forEach((handle: string) => {
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
  }, [data, error])
  return null
}
