import type { NextConfig } from "next";
import type { Configuration } from "webpack";

const nextConfig: NextConfig = {
  // Configure image optimization settings
  images: {
    // Allow remote image loading from Contentful CDN
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
        port: "",
        pathname: "/qpmljli25mkn/**",
      },
    ],

    // Supported image formats for optimization
    formats: ["image/webp", "image/avif"] as const,

    // Cache images for 1 hour
    minimumCacheTTL: 3600,
  },

  // Advanced webpack configuration for image processing
  webpack: (config: Configuration) => {
    // Add image optimization loader
    if (config.module?.rules) {
      config.module.rules.push({
        test: /\.(webp|png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: "image-webpack-loader",
            options: {
              // WebP compression settings
              webp: {
                quality: 75,
                lossless: false,
              },
              // JPEG optimization
              mozjpeg: {
                progressive: true,
                quality: 65,
              },
              // PNG optimization
              optipng: {
                enabled: false,
              },
              // Advanced PNG compression
              pngquant: {
                quality: "65-90",
                speed: 4,
              },
              // GIF optimization
              gifsicle: {
                interlaced: false,
              },
            },
          },
        ],
      });
    }

    return config;
  },

  // Enable strict mode for better performance and warnings
  reactStrictMode: true,

  // Optional: Configure compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
