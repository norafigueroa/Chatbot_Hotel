import { MODELS, MAX_TOKENS, SYSTEM_PROMPT } from '../utils/constants'
import type { ChatMessage } from '../types'

/**
 * Servicio de chat vía OpenRouter (https://openrouter.ai).
 *
 * Usa el endpoint compatible con OpenAI y la función de "model fallback":
 * se envía una lista de modelos (MODELS) y si el primero falla o está saturado,
 * OpenRouter pasa automáticamente al siguiente.
 *
 * ⚠️ SEGURIDAD: corre en el navegador y la key (VITE_OPENROUTER_API_KEY) queda
 * expuesta en el bundle. Aceptable para prototipo; para producción, mover la
 * llamada a una función serverless (ver README → "Despliegue seguro").
 */

const API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY

/** Indica si la API key está configurada (para mostrar avisos en la UI). */
export const isApiKeyConfigured = Boolean(apiKey)

/** Cabeceras comunes de la petición. */
function buildHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    // OpenRouter usa este título para identificar la app (opcional).
    'X-Title': 'Isla Chiquita Chatbot',
  }
}

/** Construye el cuerpo de la petición con la cadena de modelos de respaldo. */
function buildBody(history: ChatMessage[], stream: boolean) {
  return JSON.stringify({
    models: MODELS, // lista de respaldo: si uno falla, entra el siguiente
    max_tokens: MAX_TOKENS,
    stream,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.map((m) => ({ role: m.role, content: m.content })),
    ],
  })
}

/** Convierte una respuesta de error en un mensaje amable en español. */
async function toFriendlyError(res: Response): Promise<Error> {
  let detail = ''
  try {
    const data = await res.json()
    detail = data?.error?.message ?? ''
  } catch {
    /* respuesta sin JSON */
  }

  switch (res.status) {
    case 401:
      return new Error('La API key de OpenRouter no es válida. Revisa VITE_OPENROUTER_API_KEY en tu .env.local.')
    case 402:
      return new Error('Tu cuenta de OpenRouter no tiene saldo suficiente (o está en negativo).')
    case 429:
      return new Error('Los modelos gratuitos están saturados en este momento. Espera unos segundos e intenta de nuevo. 🙏')
    default:
      return new Error(detail || `Error del servicio (${res.status}). Intenta de nuevo en unos minutos.`)
  }
}

/**
 * Envía el historial de conversación y transmite la respuesta en tiempo real
 * (streaming). Es la función que usa la UI para el efecto de "escribiendo".
 *
 * @param history  Historial de mensajes (usuario/asistente) en orden cronológico.
 * @param onText   Callback invocado con cada fragmento de texto recibido.
 * @param signal   AbortSignal opcional para cancelar la solicitud.
 * @returns        El texto completo de la respuesta del asistente, en español.
 */
export async function streamChatResponse(
  history: ChatMessage[],
  onText: (delta: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  if (!isApiKeyConfigured) {
    throw new Error(
      'No se encontró la API key. Define VITE_OPENROUTER_API_KEY en tu archivo .env.local.',
    )
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: buildHeaders(),
    body: buildBody(history, true),
    signal,
  })

  if (!res.ok || !res.body) {
    throw await toFriendlyError(res)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let full = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? '' // la última línea puede estar incompleta

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed.startsWith('data:')) continue // ignora comentarios/keepalive

      const data = trimmed.slice(5).trim()
      if (data === '[DONE]') continue

      try {
        const json = JSON.parse(data)
        const delta: string | undefined = json?.choices?.[0]?.delta?.content
        if (delta) {
          full += delta
          onText(delta)
        }
      } catch {
        /* fragmento incompleto o evento sin contenido: se ignora */
      }
    }
  }

  return full
}

/**
 * Versión simple (sin streaming): devuelve la respuesta completa de una vez.
 *
 * @param history  Historial de mensajes en orden cronológico.
 * @returns        El texto completo de la respuesta del asistente, en español.
 */
export async function sendMessage(history: ChatMessage[]): Promise<string> {
  if (!isApiKeyConfigured) {
    throw new Error(
      'No se encontró la API key. Define VITE_OPENROUTER_API_KEY en tu archivo .env.local.',
    )
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: buildHeaders(),
    body: buildBody(history, false),
  })

  if (!res.ok) {
    throw await toFriendlyError(res)
  }

  const data = await res.json()
  return data?.choices?.[0]?.message?.content ?? ''
}
