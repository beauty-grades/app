/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
    fontLoaders: [
      {
        loader: "@next/font/google",
        options: { subsets: ["latin"] },
      },
    ],
  },
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "images.unsplash.com",
      "http2.mlstatic.com",
      "res.cloudinary.com",
      "xsgames.co",
      "pbs.twimg.com",
      "cdn.discordapp.com",
      "i.imgur.com",
    ],
  },
}

export default nextConfig
