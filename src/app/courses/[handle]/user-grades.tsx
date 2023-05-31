"use client"

import React from "react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { AnimatePresence, motion } from "framer-motion"
import { useSession } from "next-auth/react"
import * as ReactDOMClient from "react-dom/client"
import useSWR from "swr"

import { groupBy } from "@/lib/utils/group-by"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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
    status === "authenticated" && `/api/courses/${course_handle}`,
    {
      refreshInterval: 0,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  const periods:
    | {
        status: string
        section: number
        period: string
        final_score: number | null
        grades: {
          label: string
          score: number | null
          handle: string
          weight: number
        }[]
      }[]
    | undefined
    | null = data

  React.useEffect(() => {
    if (error) return
    if (!data) return
    if (data.length === 0) return

    const periods = data as {
      period: string
      status: "enrolled" | "dropped_out" | "failed" | "passed"
    }[]

    periods.forEach(({ period, status }) => {
      const period_el = document.querySelector(`#badge-for-${period}`)
      if (period_el) {
        const root = ReactDOMClient.createRoot(period_el)
        let variant: "default" | "destructive" | "outline" | "secondary" =
          "default"
        switch (status) {
          case "enrolled":
            variant = "outline"
            break
          case "dropped_out":
            variant = "destructive"
            break
          case "failed":
            variant = "destructive"
            break
          case "passed":
            variant = "default"
            break
        }

        let label = ""
        switch (status) {
          case "enrolled":
            label = "Cursando"
            break
          case "dropped_out":
            label = "Retirado"
            break
          case "failed":
            label = "Reprobado"
            break
          case "passed":
            label = "Aprobado"
            break
        }

        root.render(<Badge variant={variant}>{label}</Badge>)
      }
    })
  }, [data, error])

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

          if (state === "active") {
            if (!!periods) {
              periods.forEach((period) => {
                if (period.final_score) {
                  const final_score_el = document.querySelector(
                    `#final_score-${period.period}`
                  )

                  if (final_score_el) {
                    final_score_el.textContent =
                      "Promedio final: " + period.final_score?.toString()
                  }
                }

                period.grades.forEach((grade) => {
                  if (grade.score) {
                    const grade_el = document.querySelector(
                      `#grade-${period.period}-${grade.handle}`
                    )

                    if (grade_el) {
                      grade_el.textContent = grade.score.toString()
                    }
                  }
                })
              })

              const current_period = data.find((p) => p.period === period)
              if (current_period?.grades?.length > 0) {
                const resume_grades = groupBy(current_period.grades, "label")
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
