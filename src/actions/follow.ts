"use server"

import Xata from "@/lib/xata"

export async function follow() {
  console.log("Running on the server")
  const course = await Xata.db.course.read("AM0038")
  console.log(course)
}
