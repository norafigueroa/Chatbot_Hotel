/**
 * Adaptador de proveedor de IA.
 *
 * Todo el resto del backend habla con este módulo, no con OpenRouter ni con
 * Anthropic directamente. Para pasar del prototipo (OpenRouter) al entregable
 * final (Claude) basta cambiar la variable de entorno LLM_PROVIDER; el resto
 * del código NO cambia.
 *
 *   LLM_PROVIDER=openrouter   (prototipo, modelos gratis)
 *   LLM_PROVIDER=anthropic    (entregable final, Claude)
 *
 * Ambos proveedores se consumen por streaming (Server-Sent Events) usando
 * `fetch`, sin SDKs pesados. La función expone un único formato de salida:
 * un stream de fragmentos de texto (string).
 */

export type ChatRole = 'user' | 'assistant'

export interface ChatTurn {
  role: ChatRole
  content: string
}

export interface StreamOptions {
  system: string
  messages: ChatTurn[]
  maxTokens?: number
  signal?: AbortSignal
}

const PROVIDER = (process.env.LLM_PROVIDER ?? 'openrouter').toLowerCase()
const MAX_TOKENS_DEFAULT = 1000

// Modelos por proveedor. Se pueden sobrescribir por variable de entorno.
const OPENROUTER_MODELS = (
  process.env.OPENROUTER_MODELS ??
  'nvidia/nemotron-3-ultra-550b-a55b:free,poolside/laguna-m.1:free'
)
  .split(',')
  .map((m) => m.trim())
  .filter(Boolean)

const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-5'

/**
 * Envía la conversación al proveedor activo y devuelve un ReadableStream de
 * texto plano (los fragmentos de la respuesta, en orden).
 */
export async function streamChat(opts: StreamOptions): Promise<ReadableStream<Uint8Array>> {
  if (PROVIDER === 'anthropic') return streamAnthropic(opts)
  return streamOpenRouter(opts)
}

/** Codifica texto a Uint8Array para el stream de salida. */
function encoder() {
  return new TextEncoder()
}

// =====================================================================
// OpenRouter (endpoint compatible con OpenAI)
// =====================================================================
async function streamOpenRouter({
  system,
  messages,
  maxTokens = MAX_TOKENS_DEFAULT,
  signal,
}: StreamOptions): Promise<ReadableStream<Uint8Array>> {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) throw new LlmError(500, 'Falta OPENROUTER_API_KEY en el servidor.')

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'X-Title': 'Isla Chiquita Chatbot',
    },
    signal,
    body: JSON.stringify({
      models: OPENROUTER_MODELS,
      max_tokens: maxTokens,
      stream: true,
      messages: [{ role: 'system', content: system }, ...messages],
    }),
  })

  if (!res.ok || !res.body) throw await errorFromResponse(res)

  return transformSse(res.body, (json) => json?.choices?.[0]?.delta?.content)
}

// =====================================================================
// Anthropic (Claude — Messages API)
// =====================================================================
async function streamAnthropic({
  system,
  messages,
  maxTokens = MAX_TOKENS_DEFAULT,
  signal,
}: StreamOptions): Promise<ReadableStream<Uint8Array>> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new LlmError(500, 'Falta ANTHROPIC_API_KEY en el servidor.')

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    signal,
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: maxTokens,
      stream: true,
      // En Claude el prompt de sistema va en un campo aparte, no en messages.
      system,
      messages,
    }),
  })

  if (!res.ok || !res.body) throw await errorFromResponse(res)

  // En Claude el texto llega en eventos content_block_delta -> delta.text
  return transformSse(res.body, (json) =>
    json?.type === 'content_block_delta' ? json?.delta?.text : undefined,
  )
}

// =====================================================================
// Utilidades comunes
// =====================================================================

/**
 * Transforma un stream SSE (líneas "data: {...}") en un stream de texto plano,
 * extrayendo el fragmento con `pick`. Sirve para ambos proveedores.
 */
function transformSse(
  body: ReadableStream<Uint8Array>,
  pick: (json: any) => string | undefined,
): ReadableStream<Uint8Array> {
  const enc = encoder()

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? '' // la última línea puede estar incompleta

          for (const line of lines) {
            const trimmed = line.trim()
            // Ignora comentarios/keepalive (":") y líneas que no son datos.
            if (!trimmed.startsWith('data:')) continue
            const data = trimmed.slice(5).trim()
            if (!data || data === '[DONE]') continue
            try {
              const json = JSON.parse(data)
              const delta = pick(json)
              if (delta) controller.enqueue(enc.encode(delta))
            } catch {
              /* evento sin JSON válido o sin texto: se ignora */
            }
          }
        }
      } catch (err) {
        controller.error(err)
        return
      } finally {
        reader.releaseLock()
      }
      controller.close()
    },
  })
}

/** Error con código HTTP para responder al frontend con un mensaje amable. */
export class LlmError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function errorFromResponse(res: Response): Promise<LlmError> {
  let detail = ''
  try {
    const data = await res.json()
    detail = data?.error?.message ?? ''
  } catch {
    /* respuesta sin JSON */
  }
  switch (res.status) {
    case 401:
      return new LlmError(401, 'La API key del proveedor de IA no es válida.')
    case 402:
      return new LlmError(402, 'La cuenta del proveedor de IA no tiene saldo suficiente.')
    case 429:
      return new LlmError(429, 'El servicio de IA está saturado en este momento. Intentá de nuevo en unos segundos. 🙏')
    default:
      return new LlmError(res.status || 500, detail || 'Error del servicio de IA. Intentá de nuevo en unos minutos.')
  }
}
