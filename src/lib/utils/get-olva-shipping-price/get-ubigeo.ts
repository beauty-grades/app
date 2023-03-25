import { UBIGEOS } from "@/lib/constants/ubigeos"

export const getUbigeo = (
  departamento_name: string,
  provincia_name: string,
  distrito_name: string
) => {
  const departamento_ubigeo = Object.keys(UBIGEOS).find(
    (ubigeo) => UBIGEOS[ubigeo].departamento_name === departamento_name
  )

  if (!departamento_ubigeo) {
    return null
  }

  const provincia_ubigeo = Object.keys(
    UBIGEOS[departamento_ubigeo].provincias
  ).find(
    (ubigeo) =>
      UBIGEOS[departamento_ubigeo].provincias[ubigeo].provincia_name ===
      provincia_name
  )

  if (!provincia_ubigeo) {
    return null
  }

  const distrito_ubigeo = Object.keys(
    UBIGEOS[departamento_ubigeo].provincias[provincia_ubigeo].distritos
  ).find(
    (ubigeo) =>
      UBIGEOS[departamento_ubigeo].provincias[provincia_ubigeo].distritos[
        ubigeo
      ].distrito_name === distrito_name
  )

  if (!distrito_ubigeo) {
    return null
  }

  return {
    departamento_ubigeo,
    provincia_ubigeo,
    distrito_ubigeo,
  }
}
