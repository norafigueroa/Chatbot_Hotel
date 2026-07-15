/**
 * POST /api/lead
 *
 * Recibe los datos de contacto capturados por el chatbot, los guarda en la
 * base de datos (fuente de verdad) y notifica al hotel por correo.
 *
 * Cuerpo esperado:
 *   { name?, phone?, country?, email?, conversation? }
 *
 * Estrategia de robustez: primero se guarda el lead en la base; el correo es
 * secundario, así que si el envío falla igual respondemos éxito (el dato no
 * se pierde).
 */

import { insertLead, type LeadInput } from './_lib/supabase'
import { sendLeadEmail } from './_lib/email'

export const config = { runtime: 'edge' }

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return json({ error: 'Método no permitido.' }, 405)

  let body: any
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Cuerpo inválido.' }, 400)
  }

  const lead: LeadInput = {
    name: str(body?.name),
    phone: str(body?.phone),
    country: str(body?.country),
    email: str(body?.email),
    conversation: str(body?.conversation),
  }

  // Al menos un dato de contacto real (correo o teléfono).
  if (!lead.email && !lead.phone) {
    return json({ error: 'Se requiere al menos un correo o teléfono.' }, 400)
  }
  if (lead.email && !isEmail(lead.email)) {
    return json({ error: 'El correo no tiene un formato válido.' }, 400)
  }

  try {
    await insertLead(lead)
  } catch (err) {
    console.error('[lead] error al guardar en base:', err)
    return json({ error: 'No pudimos guardar tus datos. Intentá de nuevo o escribinos a reserve@islachiquita.com.' }, 500)
  }

  // El correo es best-effort: no bloquea la respuesta al usuario.
  try {
    await sendLeadEmail(lead)
  } catch (err) {
    console.error('[lead] error al enviar correo (el lead sí se guardó):', err)
  }

  return json({ ok: true })
}

function str(v: unknown): string | undefined {
  if (typeof v !== 'string') return undefined
  const t = v.trim()
  return t ? t.slice(0, 500) : undefined
}

function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}
