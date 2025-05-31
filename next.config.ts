import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
      use: ["raw-loader"],
    });
    config.module.rules.push({
      test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
      use: ["style-loader", "css-loader"],
    });
    return config;
  },
  images: {
    domains: [
      "img.vietqr.io",
      "ui-avatars.com",
      "upload.wikimedia.org",
      "encrypted-tbn0.gstatic.com",
      "cdn.example.org",
      "images.example.net",
    ], // Thêm tất cả các domain tại đây
  },
};

export default nextConfig;
