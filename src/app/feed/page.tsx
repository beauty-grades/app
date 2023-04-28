import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Paragraph } from "@/ui/typography"

import { getEmail } from "@/lib/utils/auth/get-email"
import Xata from "@/lib/xata"

const checkIsPopulating = async (email: string) => {
  const student = await Xata.db.student.filter({ email }).getFirst()

  return {
    populating: !!student?.populating,
    last_populated_at: student?.last_populated_at || null,
  }
}

const PopulatePage = async () => {
  const cookieStore = cookies()
  const email = await getEmail(cookieStore)

  if (!email) {
    redirect("/api/auth/signin")
  }

  const { populating, last_populated_at } = await checkIsPopulating(email)

  return (
    <div className="container">
      <Paragraph>
        {populating &&
          "Estamos procesando tu información. Esto puede tardar unos minutos."}
      </Paragraph>

      <Paragraph>
        {last_populated_at && (
          <>
            Última vez que se procesó tu información:{" "}
            <strong>{last_populated_at.toLocaleString()}</strong>
          </>
        )}
      </Paragraph>
    </div>
  )
}

export default PopulatePage
