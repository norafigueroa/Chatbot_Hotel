/**
 * POST /api/chat
 *
 * Recibe el historial de la conversación y devuelve la respuesta del asistente
 * en streaming (texto plano). El proveedor de IA (OpenRouter o Claude) y la
 * base de conocimiento se resuelven en el servidor; la API key NUNCA llega al
 * navegador.
 *
 * Cuerpo esperado: { messages: [{ role: 'user'|'assistant', content: string }] }
 *
 * Corre en el runtime Edge de Vercel (ideal para streaming).
 */

import { streamChat, LlmError, type ChatTurn } from './_lib/llm'
import { buildSystemPrompt } from './_lib/knowledge'

export const config = { runtime: 'edge' }

const MAX_MESSAGES = 30
const MAX_CHARS = 4000

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return json({ error: 'Método no permitido.' }, 405)
  }

  let body: any
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Cuerpo inválido.' }, 400)
  }

  const messages = sanitizeMessages(body?.messages)
  if (!messages) {
    return json({ error: 'Se requiere un arreglo "messages" válido.' }, 400)
  }

  try {
    const system = await buildSystemPrompt()
    const stream = await streamChat({ system, messages, signal: req.signal })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
      },
    })
  } catch (err) {
    if (err instanceof LlmError) return json({ error: err.message }, err.status)
    console.error('[chat] error:', err)
    return json({ error: 'Ocurrió un error inesperado. Intentá de nuevo.' }, 500)
  }
}

/** Valida y recorta el historial recibido del cliente. */
function sanitizeMessages(raw: unknown): ChatTurn[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null
  const out: ChatTurn[] = []
  for (const m of raw.slice(-MAX_MESSAGES)) {
    const role = m?.role
    const content = m?.content
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') return null
    const trimmed = content.trim()
    if (!trimmed) continue
    out.push({ role, content: trimmed.slice(0, MAX_CHARS) })
  }
  return out.length ? out : null
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}
