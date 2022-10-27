/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "tdjlfjwegkryvjsjfluw.supabase.in",
      "tdjlfjwegkryvjsjfluw.supabase.co",
      "lh3.googleusercontent.com",
      "platform-lookaside.fbsbx.com",
      "avatars.githubusercontent.com",
      "amrtyhmeczslejkgyfoe.supabase.in",
      "amrtyhmeczslejkgyfoe.supabase.co",
    ],
  },
};

module.exports = nextConfig;
