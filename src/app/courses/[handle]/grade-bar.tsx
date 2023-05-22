"use client"

import { AnimatePresence, motion } from "framer-motion"

interface GradeBarProps {
  handle: string
  grades?: number[]
  average: number
  weight: number
  delete_lowest?: boolean
  delay?: number
}

export const GradeBar = ({
  handle,
  average,
  weight,
  grades = [1],
  delete_lowest = false,
  delay = 0.3,
}: GradeBarProps) => {
  const bg_color =
    weight > 0
      ? "bg-gradient-to-r from-red-600 to-purple-600"
      : "bg-gradient-to-r from-slate-600 to-slate-600"

  return (
    <AnimatePresence>
      <div className="flex items-center gap-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            width: weight > 0 ? weight * 100 + "%" : "33.33%",
          }}
          className="relative flex items-center justify-between overflow-hidden rounded-lg bg-slate-700"
        >
          <div className="z-10 flex w-full justify-between p-2">{handle}</div>
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: (average / 20) * 100 + "%",
              transition: { delay },
            }}
            className={"absolute left-0 z-0 h-full " + bg_color}
          />
        </motion.div>
        <span className="font-bold">{Math.round(average * 100) / 100}</span>
      </div>
    </AnimatePresence>
  )
}
