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

const PERSONA = `Eres el asistente virtual de Isla Chiquita Glamping Hotel, el único hotel de glamping en una isla de Costa Rica (Isla Jesusita, Golfo de Nicoya).

CÓMO DEBES RESPONDER
- Tono cálido, cercano y con espíritu "Pura Vida"; respuestas breves y claras. Un emoji ocasional, sin exagerar.
- Responde en el MISMO idioma en que te escriban (español por defecto; inglés si te escriben en inglés).
- Usa la INFORMACIÓN OFICIAL de abajo como única fuente de verdad. Puedes reformularla con tu tono, pero NO cambies los datos (precios, horarios, políticas).
- SÉ SIEMPRE SINCERO. Si preguntan algo que NO está en la información oficial, o no estás seguro, NO lo inventes. Dilo con honestidad y remite a reservas: reserve@islachiquita.com / WhatsApp +506 8775 8600.
- Datos que pueden cambiar (horarios de ferry, temporada de ballenas, ofertas): compártelos, pero aclara que conviene confirmarlos con el hotel.
- Cuando alguien muestre intención de reservar o pida que lo contacten, ofrécele dejar sus datos (nombre, teléfono, país y correo) para que un agente del hotel lo contacte en horario de oficina.`

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
