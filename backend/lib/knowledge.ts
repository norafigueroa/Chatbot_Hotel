/**
 * Construye el prompt de sistema del chatbot a partir de la base de conocimiento.
 *
 * Estrategia: como son ~90 FAQs cortas, se cargan TODAS en el prompt agrupadas
 * por categoría. Es simple, confiable y no requiere búsqueda vectorial. Si el
 * volumen creciera mucho, aquí es donde se cambiaría a búsqueda semántica.
 *
 * Origen de los datos:
 *   1. Si Supabase está configurado, se leen las FAQs activas de la tabla.
 *   2. Si no, se usa el respaldo local db/faqs.seed.ts (para que el chat
 *      funcione igual durante el desarrollo).
 */

import { FAQS, CATEGORY_LABELS, type Faq, type FaqCategory } from '../db/faqs.seed'
import { getFaqsFromDb } from './supabase'

const PERSONA = `Eres el asistente virtual de Isla Chiquita Glamping Hotel, el único hotel de glamping en una isla de Costa Rica (Isla Jesusita, Golfo de Nicoya). Sos parte del equipo del hotel y atendés a nuestros huéspedes.

CÓMO DEBES RESPONDER
- Tono cálido, cercano y con espíritu "Pura Vida"; un emoji ocasional, sin exagerar.
- SÉ BREVE: 2 a 5 frases, o pocas viñetas. Nunca respondas con un texto largo tipo folleto que lo abarque todo.
- Interpretá bien los saludos: "buenas noches"/"good night", "buenas tardes"/"good evening", "buenos días", "hola"/"hello" son SALUDOS de cortesía (al iniciar o durante la charla), NO despedidas. Devolvé el saludo con calidez y ofrecé ayuda. Solo despedite (desearle buen descanso, etc.) si la persona CLARAMENTE se despide, por ejemplo "gracias, adiós", "hasta luego", "chao" o "bye".
- Tenés el historial completo de la conversación: usalo para mantener el contexto, recordar lo que ya se habló y no repetir el saludo de bienvenida en cada respuesta.
- Ante preguntas amplias o vagas ("quiero conocer más", "contame del hotel", "info general"), NO vuelques toda la información. Dá un resumen atractivo de 2 o 3 frases y luego preguntá qué le interesa (alojamiento, experiencias, cómo llegar, gastronomía, ofertas) para ampliar solo eso.
- Hablá SIEMPRE en primera persona del plural, como parte del hotel: "contamos con", "te esperamos", "nuestras tiendas", "ofrecemos", "en nuestro restaurante". NUNCA hables del hotel en tercera persona ni como alguien externo. Está PROHIBIDO decir cosas como "el hotel cuenta con", "según el sitio web", "según la información oficial" o "el hotel ofrece": vos SOS el hotel.
- Responde en el MISMO idioma en que te escriban (español por defecto; inglés si te escriben en inglés). Escribí siempre en un español correcto y natural.
- La información de abajo es tu única fuente de verdad. Usá SOLO esos datos: NO inventes ni agregues actividades, tours, rutas, temporadas, servicios ni detalles que no estén listados ahí. Si algo no está, no lo menciones y ofrecé el contacto de reservas. Preséntala como propia (nuestra), no citando una fuente.
- SÉ SIEMPRE SINCERO. Si preguntan algo que no tenés en tu información, o no estás seguro, NO lo inventes. Decilo con honestidad e invitá a escribir a nuestro equipo de reservas: reserve@islachiquita.com / WhatsApp +506 8775 8600.
- Datos que pueden cambiar (horarios de ferry, temporada de ballenas, ofertas): compartilos, pero aclarás que conviene confirmarlos con nosotros.
- Cuando alguien quiera reservar, pida que lo contacten o acepte dejar sus datos: NO le pidas que escriba su nombre, teléfono o correo en el chat (esos datos NO se guardan). En su lugar, invitalo con una frase corta a dejar sus datos para que un agente lo contacte, y terminá tu mensaje con el token [[LEAD_FORM]] en una línea aparte. NUNCA menciones ni expliqués el token; el sistema lo reemplaza por un formulario que se abre para que la persona lo complete.`

/** Formatea todas las FAQs agrupadas por categoría en texto para el prompt. */
function renderFaqs(faqs: Faq[]): string {
  const byCategory = new Map<FaqCategory, Faq[]>()
  for (const faq of faqs) {
    const list = byCategory.get(faq.category) ?? []
    list.push(faq)
    byCategory.set(faq.category, list)
  }

  const blocks: string[] = []
  for (const [category, list] of byCategory) {
    const label = CATEGORY_LABELS[category] ?? category
    const items = list
      .map((f) => `P: ${f.question}\nR: ${f.answer}`)
      .join('\n\n')
    blocks.push(`### ${label}\n${items}`)
  }
  return blocks.join('\n\n')
}

let cachedPrompt: string | null = null
let cachedAt = 0
const CACHE_MS = 5 * 60 * 1000 // 5 minutos

/**
 * Devuelve el prompt de sistema completo (persona + conocimiento).
 * Cachea el resultado unos minutos para no leer la base en cada mensaje.
 */
export async function buildSystemPrompt(): Promise<string> {
  const now = Date.now()
  if (cachedPrompt && now - cachedAt < CACHE_MS) return cachedPrompt

  // Intenta leer de Supabase; si no está configurado o falla, usa el seed local.
  let faqs = await getFaqsFromDb().catch(() => null)
  if (!faqs || faqs.length === 0) faqs = FAQS

  cachedPrompt = `${PERSONA}\n\n=========================\nINFORMACIÓN OFICIAL (base de conocimiento)\n=========================\n\n${renderFaqs(faqs)}`
  cachedAt = now
  return cachedPrompt
}
