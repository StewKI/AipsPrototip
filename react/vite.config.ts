import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        allowedHosts: [
            ".ngrok-free.app" 
        ],
        proxy: {
            "/api/auth": {
                target: "http://backend:8080",
                ws: true,
                changeOrigin: true,
                secure: false
            },
            "/hubs/whiteboard": {
                target: "http://backend:8080",
                ws: true,
                changeOrigin: true,
                secure: false
            }
        }
    }
})
