interface SiteConfig {
  name: string
  description: string
  links: {
    facebook: string
    instagram: string
  }
}

export const siteConfig: SiteConfig = {
  name: "Fitpeak: LLega a lo más alto",
  description: "Empresa dedicada a la venta de accesorios para el deporte.",
  links: {
    facebook: "https://www.facebook.com/fitpeak.shop",
    instagram: "https://www.instagram.com/fitpeak.shop",
  },
}
