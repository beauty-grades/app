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
  `Top ${Intl.NumberFormat("us").format(number).toString()}%`

export const RankingChart = ({
  data,
}: {
  data: {
    period: string
    score: number | null
  }[]
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Ranking</CardTitle>
      <CardDescription>Tu ranking a lo largo del tiempo.</CardDescription>
    </CardHeader>
    <CardContent>
      <AreaChart
        data={data}
        index="period"
        categories={["ranking"]}
        colors={["lime"]}
        valueFormatter={dataFormatter}
        yAxisWidth={60}
      />
    </CardContent>
  </Card>
)
