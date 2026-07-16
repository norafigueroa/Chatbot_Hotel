/** Rol de un mensaje dentro de la conversación con el chatbot. */
export type ChatRole = 'user' | 'assistant'

/** Un mensaje individual del historial de conversación. */
export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
}

/** Resumen de reseñas mostrado en la tarjeta flotante del hero. */
export interface ReviewSource {
  name: string
  score: string
  outOf: string
}
