interface SiteConfig {
  name: string
  description: string
  links: {
    facebook: string
    instagram: string
  }
}

export const siteConfig: SiteConfig = {
  name: "Coollege",
  description: "Hagamos la universidad más cool",
  links: {
    facebook: "https://www.facebook.com/fitpeak.shop",
    instagram: "https://www.instagram.com/fitpeak.shop",
  },
}
