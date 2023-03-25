import { getUbigeo } from "./get-ubigeo"
import { getOlvaQuotation } from "./olva-quotation"
import { Address } from "./types"

interface GetShippingPriceArgs {
  from?: Address
  to: Address
}

export const getOlvaShippingPrice = ({
  from = {
    departamento_name: "LIMA",
    provincia_name: "LIMA",
    distrito_name: "LIMA",
  },
  to,
}: GetShippingPriceArgs) => {
  const ubigeo_from = getUbigeo(
    from.departamento_name,
    from.provincia_name,
    from.distrito_name
  )

  const ubigeo_to = getUbigeo(
    to.departamento_name,
    to.provincia_name,
    to.distrito_name
  )

  if (!ubigeo_from || !ubigeo_to) {
    return null
  }

  return getOlvaQuotation(ubigeo_from, ubigeo_to)
}
