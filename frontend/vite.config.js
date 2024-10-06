import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api/v1': {
        target: 'https://online-project-submission-system-with.onrender.com',
        changeOrigin: true,
        rewrite:(path) => path.replace(/^\/api\/v1/, '')
      },
    },
  },
  plugins: [react()],
});
