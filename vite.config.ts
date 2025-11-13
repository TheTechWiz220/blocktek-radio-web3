import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Allow configuring the API proxy target via env (VITE_API_BASE or API_PROXY_TARGET)
    proxy: (() => {
  // default to localhost:4001 to avoid proxying back to the Vite server itself.
  // If your backend runs on a different port (e.g. 8080), set VITE_API_BASE or API_PROXY_TARGET.
  const target = process.env.VITE_API_BASE || process.env.API_PROXY_TARGET || 'http://localhost:4001';
      return {
        '/api': {
          target,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '/api')
        }
      };
    })(),
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
