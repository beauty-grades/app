"use client"

import { Heading } from "@/ui/typography"
import { LineChart } from "@tremor/react"

export const LineChartGrades = ({ data }) => {
  return (
    <div className="rounded-lg border border-zinc-700 p-4">
      <Heading as="h4">Gráfico histórico de notas en este curso</Heading>
      <LineChart
        data={data}
        categories={["Promedio"]}
        index="Periodo"
        colors={["blue"]}
        yAxisWidth={20}
      />
    </div>
  )
}
