import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4200,
    host: true, // Allow access from network (useful for Docker/VMs)
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
