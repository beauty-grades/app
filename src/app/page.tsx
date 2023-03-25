"use client"

import React from "react"
import { GlowBox } from "@/ui/glow-box"
import { Icons } from "@/ui/icons"
import { Heading, Paragraph } from "@/ui/typography"

const Page = () => {
  const [copied, setCopied] = React.useState(false)
  React.useEffect(() => {
    if (copied) {
      navigator.clipboard
        .writeText(`const { email, tokenV1 } = JSON.parse(localStorage.session)

fetch("http://localhost:3000/api/populate", {
  method: "POST",
  headers: {
    Authorization: tokenV1,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ email }),
}).then((res) => res.json()).then(console.log)`)

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

      <div className="container mt-8 mb-24">
        <GlowBox colors="from-red-600 to-purple-500">
          <div className="relative p-4">
            <pre
              className="javascript text-left text-lg text-zinc-300"
              style={{ fontFamily: "monospace" }}
            >
              <ol>
                <li style={{ fontWeight: "normal", verticalAlign: "top" }}>
                  <div
                    style={{
                      font: "normal normal 1em/1.2em monospace",
                      margin: 0,
                      padding: 0,
                      background: "none",
                      verticalAlign: "top",
                    }}
                  >
                    <span style={{ color: "#7f1d1d", fontWeight: "bold" }}>
                      const
                    </span>{" "}
                    <span style={{ color: "#0369a1" }}>{"{"}</span> email
                    <span style={{ color: "#e4e4e7" }}>,</span> tokenV1{" "}
                    <span style={{ color: "#0369a1" }}>{"}"}</span>{" "}
                    <span style={{ color: "#e4e4e7" }}>=</span> JSON.
                    <span style={{ color: "#660066" }}>parse</span>
                    <span style={{ color: "#0369a1" }}>(</span>localStorage.
                    <span style={{ color: "#660066" }}>session</span>
                    <span style={{ color: "#0369a1" }}>)</span>
                  </div>
                </li>
                <li style={{ fontWeight: "normal", verticalAlign: "top" }}>
                  <div
                    style={{
                      font: "normal normal 1em/1.2em monospace",
                      margin: 0,
                      padding: 0,
                      background: "none",
                      verticalAlign: "top",
                    }}
                  >
                    &nbsp;
                  </div>
                </li>
                <li style={{ fontWeight: "normal", verticalAlign: "top" }}>
                  <div
                    style={{
                      font: "normal normal 1em/1.2em monospace",
                      margin: 0,
                      padding: 0,
                      background: "none",
                      verticalAlign: "top",
                    }}
                  >
                    fetch<span style={{ color: "#0369a1" }}>(</span>
                    <span style={{ color: "#e4e4e7" }}>
                    &quot;http://localhost:3000/api/populate&quot;
                    </span>
                    <span style={{ color: "#e4e4e7" }}>,</span>{" "}
                    <span style={{ color: "#0369a1" }}>{"{"}</span>
                  </div>
                </li>
                <li style={{ fontWeight: "normal", verticalAlign: "top" }}>
                  <div
                    style={{
                      font: "normal normal 1em/1.2em monospace",
                      margin: 0,
                      padding: 0,
                      background: "none",
                      verticalAlign: "top",
                    }}
                  >
                    {"  "}method<span style={{ color: "#e4e4e7" }}>:</span>{" "}
                    <span style={{ color: "#e4e4e7" }}>&quot;POST&quot;</span>
                    <span style={{ color: "#e4e4e7" }}>,</span>
                  </div>
                </li>
                <li style={{ fontWeight: "bold", verticalAlign: "top" }}>
                  <div
                    style={{
                      font: "normal normal 1em/1.2em monospace",
                      margin: 0,
                      padding: 0,
                      background: "none",
                      verticalAlign: "top",
                    }}
                  >
                    {"  "}headers<span style={{ color: "#e4e4e7" }}>:</span>{" "}
                    <span style={{ color: "#0369a1" }}>{"{"}</span>
                  </div>
                </li>
                <li style={{ fontWeight: "normal", verticalAlign: "top" }}>
                  <div
                    style={{
                      font: "normal normal 1em/1.2em monospace",
                      margin: 0,
                      padding: 0,
                      background: "none",
                      verticalAlign: "top",
                    }}
                  >
                    {"    "}Authorization
                    <span style={{ color: "#e4e4e7" }}>:</span> tokenV1
                    <span style={{ color: "#e4e4e7" }}>,</span>
                  </div>
                </li>
                <li style={{ fontWeight: "normal", verticalAlign: "top" }}>
                  <div
                    style={{
                      font: "normal normal 1em/1.2em monospace",
                      margin: 0,
                      padding: 0,
                      background: "none",
                      verticalAlign: "top",
                    }}
                  >
                    {"    "}
                    <span style={{ color: "#e4e4e7" }}>&quot;Content-Type&quot;</span>
                    <span style={{ color: "#e4e4e7" }}>:</span>{" "}
                    <span style={{ color: "#e4e4e7" }}>&quot;application/json&quot;</span>
                    <span style={{ color: "#e4e4e7" }}>,</span>
                  </div>
                </li>
                <li style={{ fontWeight: "normal", verticalAlign: "top" }}>
                  <div
                    style={{
                      font: "normal normal 1em/1.2em monospace",
                      margin: 0,
                      padding: 0,
                      background: "none",
                      verticalAlign: "top",
                    }}
                  >
                    {"  "}
                    <span style={{ color: "#0369a1" }}>{"}"}</span>
                    <span style={{ color: "#e4e4e7" }}>,</span>
                  </div>
                </li>
                <li style={{ fontWeight: "normal", verticalAlign: "top" }}>
                  <div
                    style={{
                      font: "normal normal 1em/1.2em monospace",
                      margin: 0,
                      padding: 0,
                      background: "none",
                      verticalAlign: "top",
                    }}
                  >
                    {"  "}body<span style={{ color: "#e4e4e7" }}>:</span> JSON.
                    <span style={{ color: "#660066" }}>stringify</span>
                    <span style={{ color: "#0369a1" }}>(</span>
                    <span style={{ color: "#0369a1" }}>{"{"}</span> email{" "}
                    <span style={{ color: "#0369a1" }}>{"}"}</span>
                    <span style={{ color: "#0369a1" }}>)</span>
                    <span style={{ color: "#e4e4e7" }}>,</span>
                  </div>
                </li>
                <li style={{ fontWeight: "bold", verticalAlign: "top" }}>
                  <div
                    style={{
                      font: "normal normal 1em/1.2em monospace",
                      margin: 0,
                      padding: 0,
                      background: "none",
                      verticalAlign: "top",
                    }}
                  >
                    <span style={{ color: "#0369a1" }}>{"}"}</span>
                    <span style={{ color: "#0369a1" }}>)</span>.
                    <span style={{ color: "#660066" }}>then</span>
                    <span style={{ color: "#0369a1" }}>(</span>
                    <span style={{ color: "#0369a1" }}>(</span>res
                    <span style={{ color: "#0369a1" }}>)</span>{" "}
                    <span style={{ color: "#e4e4e7" }}>=&gt;</span> res.
                    <span style={{ color: "#660066" }}>json</span>
                    <span style={{ color: "#0369a1" }}>(</span>
                    <span style={{ color: "#0369a1" }}>)</span>
                    <span style={{ color: "#0369a1" }}>)</span>.
                    <span style={{ color: "#660066" }}>then</span>
                    <span style={{ color: "#0369a1" }}>(</span>console.
                    <span style={{ color: "#660066" }}>log</span>
                    <span style={{ color: "#0369a1" }}>)</span>
                  </div>
                </li>
              </ol>
            </pre>

            <div
              className="absolute -bottom-2 -right-2 rounded border border-transparent p-2 text-zinc-700 hover:border-zinc-500 hover:text-zinc-500 "
              onClick={() => setCopied(true)}
            >
              {copied ? (
                <Icons.clipboardCheck className="h-4 w-4" />
              ) : (
                <Icons.clipboard className="h-4 w-4" />
              )}
            </div>
          </div>
        </GlowBox>

        <a
          href="https://sistema-academico.utec.edu.pe/dashboard"
          target="_blank"
          rel="noreferrer"
          className="mt-2 flex items-center justify-center space-x-2 text-zinc-700"
        >
          <Icons.externalLink className="h-4 w-4" />
          <span>
            Ejecuta el programa en la <span className="underline">consola</span>{" "}
            del Sistema Académico (F12)
          </span>
        </a>

        <a
          href="https://github.com/cuevantn/checkyourwallet"
          target="_blank"
          rel="noreferrer"
          className="mt-2 flex items-center justify-center space-x-2 text-zinc-700"
        >
          <Icons.github className="h-4 w-4" />
          <span>Ver el código fuente</span>
        </a>
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
