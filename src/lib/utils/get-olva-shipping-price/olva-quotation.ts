import { Ubigeo } from "./types"

export const getOlvaQuotation = async (
  ubigeo_from: Ubigeo,
  ubigeo_to: Ubigeo
) => {
  const encodedParams = new URLSearchParams()

  encodedParams.set("HddPartner", "0")
  encodedParams.set("encuentras-departamento", ubigeo_from.departamento_ubigeo)
  encodedParams.set("encuentras-provincia", ubigeo_from.provincia_ubigeo)
  encodedParams.set("encuentras-distrito", ubigeo_from.distrito_ubigeo)
  encodedParams.set("llevamos-departamento", ubigeo_to.departamento_ubigeo)
  encodedParams.set("llevamos-provincia", ubigeo_to.provincia_ubigeo)
  encodedParams.set("llevamos-distrito", ubigeo_to.distrito_ubigeo)
  encodedParams.set("recojo", "REG")
  encodedParams.set("que", "Paquetes")
  encodedParams.set("pesa", "1")
  encodedParams.set("ancho", "30")
  encodedParams.set("largo", "15")
  encodedParams.set("alto", "10")

  let url = "https://olvacourier.com/cotizar"

  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      cookie: "ci_session=756oeehvpqkbr6ckb4anvmcknc1vrc9i; ",
    },
    body: encodedParams,
  }

  const res = await fetch(url, options)
  const data = await res.json()

  return parseFloat(data?.costo) ?? null
}
