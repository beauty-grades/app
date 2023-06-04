import { NextResponse } from "next/server"
import { Matrix } from "ml-matrix"

export function GET() {
  const emb_1 = [1, 2, 3, 4, 5]
  const emb_2 = [2, 4, 6, 8, 10]

  const matrix_1 = Matrix.columnVector(emb_1)
  const matrix_2 = Matrix.columnVector(emb_2)

  // M1 <- 0.8*M1 + 0.2*M2
  const updated_matrix = matrix_1.mul(0.8).add(matrix_2.mul(0.2))

  return NextResponse.json({ updated_embedding: updated_matrix.getColumn(0) })
}
