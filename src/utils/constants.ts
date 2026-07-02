/**
 * Configuración central del chatbot y datos de la landing.
 * Cambiar el modelo aquí es suficiente para actualizarlo en toda la app.
 */

// Cadena de modelos (OpenRouter) con respaldo automático: si el primero falla o
// está saturado, entra el siguiente. Máximo 3. Todos son modelos GRATIS (:free)
// tipo "instruct" (chat directo, buenos en español). Para cambiarlos, edita esta
// lista con IDs de https://openrouter.ai/models?max_price=0
export const MODELS = [
  'nvidia/nemotron-3-ultra-550b-a55b:free',
  'poolside/laguna-m.1:free',
]

// Límite de tokens de salida por respuesta del chatbot.
export const MAX_TOKENS = 1000

// Prompt base que define la personalidad y el conocimiento del asistente.
export const SYSTEM_PROMPT = `Eres un asistente amable de Isla Chiquita Glamping Hotel, ubicado en el Golfo de Nicoya, Costa Rica.
Tu objetivo es ayudar a los visitantes potenciales respondiendo preguntas sobre:
- Transporte: Ferry desde Puntarenas ($)
- Precios del hotel
- Atractivos: bioluminiscencia, parques nacionales, playas
- Actividades disponibles
- Métodos de pago
Sé conciso, amable, y siempre en español.`

// Mensaje de bienvenida que ve el usuario al abrir el chat.
export const WELCOME_MESSAGE =
  '¡Hola! 🌿 Soy el asistente de Isla Chiquita. Puedo ayudarte con transporte, precios, experiencias y la bioluminiscencia del Golfo de Nicoya. ¿En qué te ayudo?'

// Preguntas sugeridas para arrancar la conversación.
export const SUGGESTED_QUESTIONS = [
  '¿Cómo llego a Isla Chiquita?',
  '¿Qué es la bioluminiscencia?',
  '¿Qué experiencias ofrecen?',
]

// Enlace de WhatsApp del hotel (reemplazar por el número real).
export const WHATSAPP_URL = 'https://wa.me/50600000000'
