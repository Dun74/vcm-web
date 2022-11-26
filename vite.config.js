import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sassDts from 'vite-plugin-sass-dts'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/vcm/",
  server: {    // <-- this object is added
    port: 3000
  },
  plugins: [react(), sassDts()]
})
