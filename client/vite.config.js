import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/user": {
        target: "https://mern-stack-overflow.onrender.com", // Adjust to your backend server's address and port
        changeOrigin: true,
      },
    },
  },
});
