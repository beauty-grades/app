import { NextResponse } from "next/server";
import { Matrix } from "ml-matrix";

export function GET() {
  const emb_1 = [1, 2, 3, 4, 5];
  const emb_2 = [2, 4, 6, 8, 10];

  const matrix_1 = Matrix.columnVector(emb_1);
  const matrix_2 = Matrix.columnVector(emb_2);

  // M1 <- 0.8*M1 + 0.2*M2
  const resultant_matrix = matrix_1.mul(0.8).add(matrix_2.mul(0.2));
  const response_matrix = resultant_matrix.getColumn(0);

  // get the original embedding from the updated matrix and the added matrix
  const original_matrix = resultant_matrix
    .sub(Matrix.columnVector(emb_2).mul(0.2))
    .div(0.8);

  return NextResponse.json({
    embedding_1: emb_1,
    embedding_2: emb_2,
    resultant_embedding: response_matrix,
    original_embedding: original_matrix.getColumn(0),
  });
}
