import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/user": {
        // target: "http://localhost:5000",
        target: "https://mern-stack-overflow.onrender.com",
        changeOrigin: true,
      },
    },
  },
});
