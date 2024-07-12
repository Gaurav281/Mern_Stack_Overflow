import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/user": {
        target: "http://localhost:5000", // Adjust to your backend server's address and port
        changeOrigin: true,
      },
    },
  },
});
