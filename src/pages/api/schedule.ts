import { NextApiRequest, NextApiResponse } from "next"

import Xata from "@/lib/xata"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === "OPTIONS") {
      res.status(200).end()
      return
    } else if (req.method === "POST") {
      const auth_token = req.headers["authorization"]
      const email = req.body.email

      if (!auth_token) {
        return res.json({ error: "No auth token" })
      } else if (!email) {
        return res.json({ error: "No email" })
      }

      const student = await Xata.db.student.filter({ email }).getFirst()

      if (!student) {
        await Xata.db.student.create({
          email,
          utec_token: auth_token,
          last_token_stored_at: new Date(),
        })
      } else {
        await student.update({
          utec_token: auth_token,
          last_token_stored_at: new Date(),
        })
      }

      res.status(200).json({
        status: "¡Listo! Estamos transfiriendo tu data ;)",
        callback:
          "Ve al dashboard de BeautyGrades para ver tus notas :) y luego espera 2 minutos.",
        fallback:
          "Si no ves nada pasados los dos minutos, recarga la página una vez más :0. Si aún así no ves nada, escríbenos a hi.cuevantn@gmail.com ;)",
      })
      return
    } else {
      res.status(405).end()
      return
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Internal server error" })
    return
  }
}

export default handler
