"use client"

import { Card, LineChart, Title } from "@tremor/react"

const dataFormatterRanking = (number: number) =>
  `Top ${Intl.NumberFormat("us").format(number).toString()}%`

const dataFormatterScore = (number: number) =>
  Intl.NumberFormat("us").format(number).toString()
export const LineChartXD = ({
  data,
}: {
  data: {
    period: string
    score: number | null
    score_percentile: number | null
    merit_order: number | null
    total_students: number | null
    ranking: number | null
    career: string
  }[]
}) => (
  <>
    <Card>
      <Title>Ranking Académico</Title>
      <LineChart
        className="mt-6"
        data={data}
        index="period"
        categories={["ranking"]}
        colors={["orange"]}
        valueFormatter={dataFormatterRanking}
        yAxisWidth={60}
      />
    </Card>
    <Card>
      <Title>Promedio Ponderado</Title>
      <LineChart
        className="mt-6"
        data={data}
        index="period"
        categories={["score"]}
        colors={["violet"]}
        valueFormatter={dataFormatterScore}
        yAxisWidth={60}
      />
    </Card>
  </>
)
