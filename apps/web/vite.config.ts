import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/",
  server: {
    host: "::",
    allowedHosts: ["localhost"],
    port: 4300,
    cors: true,
    fs: {
      allow: [".."],
    },
    strictPort: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    "process.env.API_DOMAIN": JSON.stringify(process.env.API_DOMAIN || ""),
    "process.env.WEB_DOMAIN": JSON.stringify(process.env.WEB_DOMAIN || ""),
  },
});
