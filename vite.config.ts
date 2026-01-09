import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { keycloakify } from "keycloakify/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        keycloakify({
            accountThemeImplementation: "none"
        })
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src")
        }
    }
});
