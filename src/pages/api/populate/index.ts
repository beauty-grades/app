import { NextApiRequest, NextApiResponse } from "next"

import { populate } from "./script"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://sistema-academico.utec.edu.pe"
  )
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type")

  if (req.method === "OPTIONS") {
    return res.status(200).end()
  } else if (req.method === "POST") {
    const auth_token = req.headers["authorization"]
    const email = req.body.email

    if (!auth_token) {
      return res.json({ error: "No auth token" })
    } else if (!email) {
      return res.json({ error: "No email" })
    }

    await populate(auth_token, email)

    return res.status(200).json({ message: "OK" })
  } else {
    return res.status(405).end()
  }
}

export default handler
