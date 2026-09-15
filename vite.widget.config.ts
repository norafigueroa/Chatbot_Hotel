import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Build SEPARADO del widget embebible (el "script de proveedor" que se le
 * entrega al equipo que integra el chatbot al sitio real del hotel).
 *
 * Genera un único archivo `widget.js` autocontenido: React, componentes y CSS
 * (Tailwind incluido) van todos adentro, sin depender de ningún HTML ni CSS
 * del sitio anfitrión.
 *
 * Se agrega DENTRO de dist/ (junto al sitio de demo), no en una carpeta
 * aparte: así Vercel lo publica solo, en la misma URL de siempre, sin
 * necesitar un hosting extra. `npm run build` ya lo incluye automáticamente
 * (corre este build después del principal, sin borrar lo que ya generó).
 *
 * Variables de entorno:
 *   .env.widget       -> valores de producción (SÍ se sube a git; son URLs
 *                        públicas, no secretos).
 *   .env.widget.local -> para probar en local contra localhost (NO se sube).
 *   VITE_API_BASE   -> URL del backend (a dónde llamar /api/chat y /api/lead)
 *   VITE_ASSET_BASE -> URL donde viven las imágenes del widget (logo, ícono)
 */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] === undefined) process.env[key] = value
  }

  return {
    root: 'frontend',
    publicDir: false, // las imágenes se sirven desde VITE_ASSET_BASE, no hace falta copiarlas acá.
    plugins: [react()],
    // El modo "lib" de Vite no reemplaza process.env.NODE_ENV automáticamente
    // como sí lo hace el build normal (basado en index.html); React lo necesita.
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode === 'widget' ? 'production' : mode),
    },
    build: {
      outDir: '../dist',
      emptyOutDir: false, // el build principal ya corrió antes y llenó dist/; no lo borramos.
      cssCodeSplit: false,
      lib: {
        entry: 'src/widget-entry.tsx',
        formats: ['iife'],
        name: 'IslaChiquitaChatWidget',
        fileName: () => 'widget.js',
      },
    },
  }
})
