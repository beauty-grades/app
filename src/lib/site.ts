interface SiteConfig {
  name: string
  description: string
  links: {
    facebook: string
    instagram: string
  }
}

export const siteConfig: SiteConfig = {
  name: "BeautyGrades",
  description: "Tu historial académico como siempre lo deseaste",
  links: {
    facebook: "https://www.facebook.com/fitpeak.shop",
    instagram: "https://www.instagram.com/fitpeak.shop",
  },
}
