import { NextApiRequest, NextApiResponse } from "next"

import { populate } from "./script"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const auth_token = process.env.TEST_AUTH_TOKEN
    const email = process.env.TEST_EMAIL

    if (!auth_token || !email) {
      res.status(400).json({ error: "Missing auth token or email" })
      return
    }

    // take the time it takes to populate the database
    const start = Date.now()
    const [local, xata] = await populate(auth_token, email)
    const end = Date.now()

    const elapsedSeconds = Math.floor((start - end) / 1000)

    const minutes = Math.floor(elapsedSeconds / 60)
    const seconds = elapsedSeconds % 60

    console.log(`${minutes}:${seconds.toString().padStart(2, "0")}`)

    res.status(200).json({ message: "Populated", local, xata })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}

export default handler
