/**
 * Plugin de Vite SOLO para desarrollo.
 *
 * Sirve las funciones de la carpeta /api (que en producción corren en Vercel)
 * dentro del servidor de desarrollo de Vite, para que `npm run dev` levante
 * frontend + backend juntos. En producción esto no se usa: Vercel ejecuta las
 * funciones directamente.
 *
 * Traduce entre el mundo Node (req/res del servidor de Vite) y el mundo Web
 * (Request/Response que usan los handlers estilo Vercel Edge).
 */

import type { Plugin } from 'vite'
import type { IncomingMessage } from 'node:http'
import { Readable } from 'node:stream'
import { resolve } from 'node:path'

export function apiDevServer(): Plugin {
  return {
    name: 'isla-chiquita-api-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? ''
        if (!url.startsWith('/api/')) return next()

        // "/api/chat?x=1" -> "chat"
        const route = url.split('?')[0].replace(/^\/api\//, '').replace(/\/$/, '')

        try {
          // La carpeta api/ está en la RAÍZ del repo (no dentro de frontend/,
          // que es el root de Vite). Por eso se resuelve con ruta absoluta desde
          // process.cwd() (donde corre `npm run dev`).
          const file = resolve(process.cwd(), 'api', `${route}.ts`).replace(/\\/g, '/')
          const mod = await server.ssrLoadModule(file)
          const handler = mod.default

          if (typeof handler !== 'function') {
            res.statusCode = 500
            res.end(`Handler /api/${route} inválido`)
            return
          }

          const request = await toWebRequest(req)
          const response: Response = await handler(request)

          res.statusCode = response.status
          response.headers.forEach((value, key) => res.setHeader(key, value))

          if (response.body) {
            Readable.fromWeb(response.body as any).pipe(res)
          } else {
            res.end(await response.text())
          }
        } catch (err) {
          console.error(`[api-dev] error en /api/${route}:`, err)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Error interno del backend (dev).' }))
        }
      })
    },
  }
}

/** Construye un Request (Web) a partir del req de Node. */
async function toWebRequest(req: IncomingMessage): Promise<Request> {
  const host = req.headers.host ?? 'localhost'
  const fullUrl = `http://${host}${req.url}`

  const headers = new Headers()
  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) value.forEach((v) => headers.append(key, v))
    else if (value != null) headers.set(key, value)
  }

  const method = req.method ?? 'GET'
  let body: Uint8Array | undefined
  if (method !== 'GET' && method !== 'HEAD') {
    const chunks: Buffer[] = []
    for await (const chunk of req) chunks.push(chunk as Buffer)
    const buf = Buffer.concat(chunks)
    if (buf.length) body = new Uint8Array(buf)
  }

  return new Request(fullUrl, { method, headers, body })
}
