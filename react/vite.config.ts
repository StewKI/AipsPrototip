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
                target: "http://localhost:5120",
                ws: true,
                changeOrigin: true,
                secure: false
            },
            "/hubs/whiteboard": {
                target: "http://localhost:5120",
                ws: true,
                changeOrigin: true,
                secure: false
            }
        }
    }
})
