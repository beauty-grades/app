import { NextApiRequest, NextApiResponse } from "next"

import { populate } from "../script"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const auth_token = process.env.TEST_AUTH_TOKEN
    const email = process.env.TEST_EMAIL

    if (!auth_token || !email) {
      res.status(400).json({ error: "Missing auth token or email" })
      return
    }

    const data = await populate(auth_token, email)

    res.status(200).json({ message: "Populated", data })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}

export default handler
