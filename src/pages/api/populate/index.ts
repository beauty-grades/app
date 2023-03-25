import { NextApiRequest, NextApiResponse } from "next"

import { populate } from "./script"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    res.setHeader(
      "Access-Control-Allow-Origin",
      "https://sistema-academico.utec.edu.pe"
    )
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS,POST")
    res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type")

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

      await populate(auth_token, email)

      res.status(200).json({ message: "OK" })
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
