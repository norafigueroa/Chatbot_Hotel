import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { apiDevServer } from './dev/api-middleware'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carga TODAS las variables de .env.local (sin filtrar por prefijo) y las
  // expone en process.env para que las funciones de /api las usen en desarrollo.
  const env = loadEnv(mode, process.cwd(), '')
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] === undefined) process.env[key] = value
  }

  return {
    // El código del frontend vive en frontend/. El build sale a /dist en la raíz
    // (donde Vercel lo espera).
    root: 'frontend',
    publicDir: 'public',
    build: {
      outDir: '../dist',
      emptyOutDir: true,
    },
    plugins: [react(), apiDevServer()],
  }
})
