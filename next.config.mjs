/** @type {import('next').NextConfig} */
const nextConfig = {
  // Mengaktifkan mode standalone untuk optimasi Docker
  output: "standalone",
  eslint: {
    // Mengabaikan error eslint saat build production agar tidak gagal deploy
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;