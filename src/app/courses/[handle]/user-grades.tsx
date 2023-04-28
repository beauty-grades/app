"use client"

import React from "react"
import Link from "next/link"
import { useToast } from "@/hooks/ui/use-toast"
import { Button } from "@/ui/button"
import { AnimatePresence, motion } from "framer-motion"
import { useSession } from "next-auth/react"
import * as ReactDOMClient from "react-dom/client"
import useSWR from "swr"

import { groupBy } from "@/lib/utils/group-by"

interface UserGradesProps {
  course_handle: string
}

export const UserGrades = ({ course_handle }: UserGradesProps) => {
  const { toast } = useToast()
  const { status } = useSession()

  React.useEffect(() => {
    if (status === "unauthenticated") {
      toast({
        title: "TIP",
        description: "Inicia sesión para ver tus notas",
        action: (
          <Link href="/api/auth/signin">
            <Button variant="outline">Sign In</Button>
          </Link>
        ),
      })
    }
  }, [status, toast])

  const { data, error } = useSWR(
    status === "authenticated" && `/api/courses/${course_handle}`
  )

  React.useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-state"
        ) {
          const element = mutation.target as Element
          const id = element.id
          const [x, period] = id.split(":")
          const state = element.getAttribute("data-state")
          console.log(`${id} data-state has changed to ${state}`)

          if (state === "active") {
            if (data?.length > 0) {
              const current_period = data.find((p) => p.period === period)
              if (current_period?.grades?.length > 0) {
                const resume_grades = groupBy(current_period.grades, "label")
                console.log(resume_grades)
                const evaluation_weight_bars =
                  element.querySelectorAll(".evaluation-weight")
                evaluation_weight_bars.forEach((el) => {
                  const [x, label] = el.id.split(":")
                  const ev = resume_grades[label]
                  const final_s = ev.reduce(
                    (acc, cur) => acc + cur.score * cur.weight,
                    0
                  )
                  const s_w = ev.reduce((acc, cur) => acc + cur.weight, 0)
                  const root = ReactDOMClient.createRoot(el)
                  root.render(<GradeBar w={final_s / 20 / s_w} />)
                })
              }
            }
          }
        }
      })
    })

    const elements = document.querySelectorAll("[data-state]")
    elements.forEach(
      (element) =>
        element.id.startsWith("period") &&
        observer.observe(element, { attributes: true })
    )

    return () => {
      observer.disconnect()
    }
  }, [data])

  if (error || data?.error) return <div>failed to load</div>

  return null
}

export interface GradeBarProps {
  average: number
  weight: number
}

export const GradeBar = ({ w }: { w: number }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ width: 0 }}
        animate={{
          width: `${w * 100}%`,
        }}
        className={
          "absolute left-0 z-0 h-full bg-gradient-to-r from-red-600 to-purple-600"
        }
      />
    </AnimatePresence>
  )
}
