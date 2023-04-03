"use client"

import React from "react"
import Link from "next/link"
import { useToast } from "@/hooks/ui/use-toast"
import { Score,Enrollment } from "@/pages/api/grades/[course_handle]"
import { Button } from "@/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs"
import { Heading } from "@/ui/typography"
import { useSession } from "next-auth/react"
import useSWR from "swr"

import { GradeBar } from "./grade-bar"

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
    status === "authenticated" && `/api/grades/${course_handle}`
  )

  if (error || data?.error) return <div>failed to load</div>
  if (!data || status === "loading") return null

  const enrollments = data.enrollments as Enrollment[]

  return (
    <>
      <Heading as="h2">Notas</Heading>
      <Tabs defaultValue="account" className="w-full mb-4">
        <TabsList>
          {enrollments.map((enrollment) => (
            <TabsTrigger key={enrollment.period} value={enrollment.period}>
              {enrollment.period}
            </TabsTrigger>
          ))}
        </TabsList>
        {enrollments.map((enrollment) => (
          <TabsContent key={enrollment.period} value={enrollment.period}>
            <View key={enrollment.period} {...enrollment} />
          </TabsContent>
        ))}
      </Tabs>
    </>
  )
}

const View = ({ period, scores }: Enrollment) => {
  if (scores.length === 0) return null

  const parsed_scores = scores as Score[]
  
  const formula = parsed_scores
    .map((score) => `${score.weight} * ${score.handle}`)
    .join(" + ")

  const final_score = parsed_scores.reduce((a, b) => {
    return a + b.average * b.weight
  }, 0)

  return (
    <>
      <Heading as="h3">{period}</Heading>
      <div className="flex w-full flex-col gap-4 overflow-hidden">
        {parsed_scores.map((score) => (
          <GradeBar
            key={score.id}
            handle={score.handle}
            average={score.average}
            weight={score.weight}
            grades={score.grades}
            delete_lowest={score.delete_lowest}
          />
        ))}
      </div>
      <div className="my-4 p-2 text-lg font-bold">
        <span>NF = {formula}</span>
      </div>
      <GradeBar handle="NF" average={final_score} weight={1} delay={0.5} />
    </>
  )
}
