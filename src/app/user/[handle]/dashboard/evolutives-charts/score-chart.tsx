"use client"

import { AreaChart } from "@tremor/react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const dataFormatter = (number: number) =>
  Intl.NumberFormat("us").format(number).toString()

export const ScoreChart = ({
  data,
}: {
  data: {
    period: string
    score: number | null
  }[]
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Promedio Ponderado</CardTitle>
      <CardDescription>
        Evolución de tu promedio ponderado a lo largo de los diferentes periodos
        en los que te matriculaste.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <AreaChart
        data={data}
        index="period"
        categories={["score"]}
        colors={["violet"]}
        valueFormatter={dataFormatter}
        yAxisWidth={60}
      />
    </CardContent>
  </Card>
)
