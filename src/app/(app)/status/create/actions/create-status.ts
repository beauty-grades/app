"use server";

import { Matrix } from "ml-matrix";
import { zfd } from "zod-form-data";

import { getMyProfileOrThrow } from "@/lib/auth/get-my-profile";
import OpenAI from "@/lib/openai";
import Xata from "@/lib/xata";
import { FormSchema } from "../form-schema";

export const createStatus = async (data: FormData) => {
  try {
    const schema = zfd.formData(FormSchema);

    const { body } = schema.parse(data);

    let profile = await getMyProfileOrThrow();

    const response = await OpenAI.createEmbedding({
      model: "text-embedding-ada-002",
      input: body,
    });

    const embedding = response.data.data[0].embedding;

    const status = await Xata.db.status.create({
      body,
      author_profile: profile.id,
      embedding: embedding,
    });

    if (!profile.embedding) {
      await profile.update({
        embedding,
      });
    } else {
      const old_matrix = Matrix.columnVector(profile.embedding);
      const new_matrix = Matrix.columnVector(embedding);
      const updated_matrix = old_matrix.mul(0.8).add(new_matrix.mul(0.2));

      await profile.update({
        embedding: updated_matrix.getColumn(0),
      });
    }

    return status.id.replace("rec_", "");
  } catch (error) {
    console.log(error);
  }
};
