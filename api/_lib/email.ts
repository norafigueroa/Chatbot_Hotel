/**
 * Envío de correo de notificación de leads vía Resend (https://resend.com).
 *
 * Variables de entorno:
 *   RESEND_API_KEY  -> SECRETA (solo servidor).
 *   LEAD_EMAIL_TO   -> correo del hotel que recibe los leads (ej. reserve@islachiquita.com).
 *   LEAD_EMAIL_FROM -> remitente verificado en Resend (ej. "Chatbot <chatbot@islachiquita.com>").
 *
 * Si no está configurado, la función no falla: registra y sigue (el lead ya
 * quedó guardado en la base de datos, que es la fuente de verdad).
 */

import type { LeadInput } from './supabase'

const API_KEY = process.env.RESEND_API_KEY
const TO = process.env.LEAD_EMAIL_TO
const FROM = process.env.LEAD_EMAIL_FROM ?? 'Chatbot Isla Chiquita <onboarding@resend.dev>'

export const isEmailConfigured = Boolean(API_KEY && TO)

export async function sendLeadEmail(lead: LeadInput): Promise<void> {
  if (!isEmailConfigured) {
    console.warn('[email] Resend no configurado; se omite el correo (el lead sí se guardó).')
    return
  }

  const rows = [
    ['Nombre', lead.name],
    ['Teléfono', lead.phone],
    ['País', lead.country],
    ['Correo', lead.email],
  ]
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0"><b>${k}</b></td><td>${escapeHtml(String(v))}</td></tr>`)
    .join('')

  const html = `
    <div style="font-family:sans-serif;color:#1a1a1a">
      <h2 style="color:#2f6f6f">Nuevo lead del chatbot 🌿</h2>
      <p>Un visitante solicitó que un agente lo contacte:</p>
      <table>${rows}</table>
      ${lead.conversation ? `<p style="margin-top:16px"><b>Contexto:</b><br>${escapeHtml(lead.conversation)}</p>` : ''}
    </div>`

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      subject: `Nuevo lead del chatbot${lead.name ? ` — ${lead.name}` : ''}`,
      html,
    }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Resend email failed: ${res.status} ${detail}`)
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
