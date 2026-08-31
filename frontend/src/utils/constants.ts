/**
 * Textos fijos de la interfaz del chat (mensaje de bienvenida y preguntas
 * sugeridas). La personalidad y el conocimiento del asistente viven en el
 * backend (backend/lib/knowledge.ts), no acá.
 */

// Mensaje de bienvenida que ve el usuario al abrir el chat.
export const WELCOME_MESSAGE =
  '¡Hola! 🌿 Soy el asistente de Isla Chiquita. Puedo ayudarte con cómo llegar, las tiendas de glamping, experiencias, ofertas y la bioluminiscencia del Golfo de Nicoya. ¿En qué te ayudo?'

// Preguntas sugeridas para arrancar la conversación.
// `label` es el texto corto del botón; `question` es lo que realmente se envía.
export type SuggestionIcon = 'map' | 'tent' | 'sparkle'

export interface SuggestedQuestion {
  label: string
  question: string
  icon: SuggestionIcon
}

export const SUGGESTED_QUESTIONS: SuggestedQuestion[] = [
  { label: '¿Cómo llego?', question: '¿Cómo llego a Isla Chiquita?', icon: 'map' },
  {
    label: 'Glamping',
    question: '¿Qué tipos de alojamiento (tiendas de glamping) tienen?',
    icon: 'tent',
  },
  { label: 'Bioluminiscencia', question: '¿Qué es la bioluminiscencia?', icon: 'sparkle' },
]
