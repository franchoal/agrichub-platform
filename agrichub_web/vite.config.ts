import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// Simple, fast native plugin to inject SEO content directly into index.html
const nativeSeoPlugin = () => ({
  name: "native-seo-injector",
  transformIndexHtml(html: string) {
    const seoContent = `
      <!-- 🤖 Googlebot Context Discovery Block -->
      <div style="display:none !important;" aria-hidden="true">
        <h1>AgricWise Africa | Smart Agricultural Ecosystem</h1>
        <p>Connecting verified agricultural businesses, crop markets, livestock suppliers, and agro-allied communities across Africa.</p>
        <nav>
          <a href="/">Home Ecosystem Portal</a>
          <a href="/businesses">Explore Verified Agribusiness Directory Listings</a>
          <a href="/products">Browse Premium Agro-Products Marketplace Catalog</a>
        </nav>
        <h2>Sourcing Farm-Fresh Produce, Inputs, and Equipment</h2>
        <p>Our digital ecosystem provides secure B2B connectivity for farmers, suppliers, and bulk buyers at myagricwyse.online.</p>
      </div>
    `;
    // Inject the SEO block right after the opening body tag
    return html.replace("<body>", `<body>\n${seoContent}`);
  }
});

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    nativeSeoPlugin(), // Native, ultra-compatible SEO booster

    VitePWA({
      registerType: "prompt",
      injectRegister: "auto",
      includeAssets: [
        "favicon.png",
        "pwa-192x192.png",
        "pwa-512x512.png",
        "pwa-maskable-512x512.png",
      ],
      manifest: {
        id: "/",
        name: "AgricWise Africa",
        short_name: "AgricWise",
        description: "Connect farmers, buyers, agricultural businesses and communities across Africa.",
        theme_color: "#15803D",
        background_color: "#FFFFFF",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          { src: "/pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/pwa-512x512.png", sizes: "512x512", type: "image/png" },
          { src: "/pwa-maskable-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,svg,woff2}"],
        navigateFallback: "index.html",
        cleanupOutdatedCaches: true,
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
});