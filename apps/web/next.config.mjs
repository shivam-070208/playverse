/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui", "@workspace/db"],
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg", "pg"],
}

export default nextConfig
