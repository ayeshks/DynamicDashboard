import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   host: true, // This allows the server to be accessed externally
  //   port: 3000, // Ensure you're using a valid port
  // },
})
