"use client"

import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export type Course = {
  id: string
  name: string
  period: string
  score: number | null
  section: number
  section_score: number | null
  dropped_out: boolean
  is_elective: boolean
  teacher: string | null
}

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="h-max"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="h-max"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const name = row.getValue("name") as string
      let label: string | null = null
      let variant:
        | "default"
        | "destructive"
        | "outline"
        | "secondary"
        | null
        | undefined = null
      if (row.original.dropped_out) {
        label = "Retirado"
        variant = "destructive"
      } else if (row.original.is_elective) {
        label = "Electivo"
        variant = "default"
      } else if (row.original.score === null && !row.original.dropped_out) {
        label = "Cursando"
        variant = "outline"
      }

      return (
        <Link href={`/courses/${row.original.id}`}>
          <div className="flex items-center">
            {label && <Badge variant={variant}>{label}</Badge>}
            <span className="ml-2">{name}</span>
          </div>
        </Link>
      )
    },
  },
  {
    accessorKey: "period",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="h-max"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Periodo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "score",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="h-max"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Puntaje
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "section",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="h-max"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Sección
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "section_score",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="h-max"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Puntaje de la Sección
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "teacher",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="h-max w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Profesor
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
]
