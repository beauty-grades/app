import Link from "next/link"
import { Button } from "@/ui/button"
import { Heading, Paragraph } from "@/ui/typography"

const LoadingPage = () => {
  return (
    <div className="container">
      <Heading>Actualizando tu data...</Heading>

      <Paragraph>
        Te recomendamos acceder a los siguientes recursos mientras tanto:
      </Paragraph>

      <Button variant="subtle">
        <Link href="/curriculums/CI-2018-1">Malla CI-2018-1</Link>
      </Button>
    </div>
  )
}

export default LoadingPage
