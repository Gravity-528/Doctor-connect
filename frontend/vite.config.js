import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"; 

export default defineConfig({
  server: {
    proxy: {
      "/api": "https://doctor-connect-2.onrender.com",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  plugins: [react()],
});