/**
 * Acceso a Supabase desde el backend.
 *
 * Se usa la REST API de Supabase directamente por `fetch` (sin SDK) para
 * mantener las funciones ligeras y portables (Node o Edge).
 *
 * IMPORTANTE sobre las llaves:
 *   - SUPABASE_URL              -> pública.
 *   - SUPABASE_SERVICE_ROLE_KEY -> SECRETA. Solo se usa en el servidor; ignora
 *     las políticas RLS y permite escribir leads. NUNCA exponerla al navegador.
 *
 * Si las variables no están configuradas, las funciones devuelven null / lanzan,
 * y el resto del backend usa el respaldo local (seed) sin romperse.
 */

import type { Faq } from '../../db/faqs.seed'

const URL = process.env.SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

export const isSupabaseConfigured = Boolean(URL && SERVICE_KEY)

function headers() {
  return {
    apikey: SERVICE_KEY as string,
    Authorization: `Bearer ${SERVICE_KEY}`,
    'Content-Type': 'application/json',
  }
}

/** Lee las FAQs activas desde la tabla `faqs`. Devuelve null si no hay config. */
export async function getFaqsFromDb(): Promise<Faq[] | null> {
  if (!isSupabaseConfigured) return null

  const res = await fetch(
    `${URL}/rest/v1/faqs?active=eq.true&select=ref,category,question,answer,keywords&order=ref.asc`,
    { headers: headers() },
  )
  if (!res.ok) throw new Error(`Supabase faqs read failed: ${res.status}`)
  return (await res.json()) as Faq[]
}

export interface LeadInput {
  name?: string
  phone?: string
  country?: string
  email?: string
  conversation?: string
}

/** Inserta un lead en la tabla `leads`. Lanza si no hay configuración. */
export async function insertLead(lead: LeadInput): Promise<void> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase no está configurado (falta SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).')
  }

  const res = await fetch(`${URL}/rest/v1/leads`, {
    method: 'POST',
    headers: { ...headers(), Prefer: 'return=minimal' },
    body: JSON.stringify({ ...lead, source: 'chatbot' }),
  })
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Supabase lead insert failed: ${res.status} ${detail}`)
  }
}
