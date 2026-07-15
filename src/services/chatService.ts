import type { ChatMessage } from '../types'

/**
 * Servicio de chat del frontend.
 *
 * Ahora habla con NUESTRO backend (/api/chat), no con OpenRouter directamente.
 * Ventaja clave: la API key del proveedor de IA vive en el servidor y NUNCA se
 * expone en el navegador. El backend decide el proveedor (OpenRouter o Claude)
 * y arma la base de conocimiento.
 *
 * El backend responde en streaming de texto plano (no SSE): cada fragmento que
 * llega se agrega directo a la respuesta.
 */

// Base opcional del backend (para producción con dominio aparte). Vacío = mismo origen.
const API_BASE = import.meta.env.VITE_API_BASE ?? ''
const CHAT_URL = `${API_BASE}/api/chat`
const LEAD_URL = `${API_BASE}/api/lead`

/**
 * Envía el historial y transmite la respuesta del asistente en tiempo real.
 *
 * @param history  Historial de mensajes (usuario/asistente) en orden cronológico.
 * @param onText   Callback invocado con cada fragmento de texto recibido.
 * @param signal   AbortSignal opcional para cancelar la solicitud.
 * @returns        El texto completo de la respuesta del asistente.
 */
export async function streamChatResponse(
  history: ChatMessage[],
  onText: (delta: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  const res = await fetch(CHAT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal,
    body: JSON.stringify({
      messages: history.map((m) => ({ role: m.role, content: m.content })),
    }),
  })

  if (!res.ok || !res.body) {
    throw await toFriendlyError(res)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let full = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value, { stream: true })
    if (chunk) {
      full += chunk
      onText(chunk)
    }
  }

  return full
}

export interface LeadData {
  name?: string
  phone?: string
  country?: string
  email?: string
  conversation?: string
}

/** Envía los datos de contacto capturados por el chatbot al backend. */
export async function submitLead(lead: LeadData): Promise<void> {
  const res = await fetch(LEAD_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lead),
  })
  if (!res.ok) throw await toFriendlyError(res)
}

/** Convierte una respuesta de error del backend en un mensaje amable. */
async function toFriendlyError(res: Response): Promise<Error> {
  let message = ''
  try {
    const data = await res.json()
    message = data?.error ?? ''
  } catch {
    /* respuesta sin JSON */
  }
  return new Error(
    message || `Error del servicio (${res.status}). Intentá de nuevo en unos minutos.`,
  )
}
