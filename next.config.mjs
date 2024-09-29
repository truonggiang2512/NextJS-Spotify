/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {

        protocol: "https",
        hostname: "vnsfpjbanpfksyftixds.supabase.co", // Replace with your actual Supabase URL
        pathname: "/storage/v1/object/public/images/**"
      },
    ]
  }
};

export default nextConfig;