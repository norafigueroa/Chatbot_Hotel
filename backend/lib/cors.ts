/**
 * CORS para que el widget embebido en OTRO dominio (el sitio del hotel) pueda
 * llamar a este backend. No hay cookies ni sesión de por medio (solo fetch +
 * JSON), así que reflejar el origen que pide es seguro.
 */

export function corsHeaders(req: Request): HeadersInit {
  const origin = req.headers.get('origin')
  return {
    'Access-Control-Allow-Origin': origin ?? '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  }
}

/** Si es un preflight (OPTIONS), devuelve la respuesta corta que espera el navegador; si no, null. */
export function handlePreflight(req: Request): Response | null {
  if (req.method !== 'OPTIONS') return null
  return new Response(null, { status: 204, headers: corsHeaders(req) })
}
