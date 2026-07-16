import { useState } from 'react'
import type { LeadData } from '../services/chatService'

interface LeadFormProps {
  onSubmit: (data: LeadData) => void
  onCancel: () => void
  isSubmitting: boolean
}

/**
 * Mini-formulario dentro del chat para que el visitante deje sus datos y el
 * hotel lo contacte. Se envía al backend (/api/lead), que lo guarda en la base.
 */
export default function LeadForm({ onSubmit, onCancel, isSubmitting }: LeadFormProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState('')
  const [email, setEmail] = useState('')

  // Requiere nombre y al menos un medio de contacto (correo o teléfono).
  const canSubmit = name.trim() !== '' && (email.trim() !== '' || phone.trim() !== '')

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!canSubmit || isSubmitting) return
    onSubmit({
      name: name.trim(),
      phone: phone.trim() || undefined,
      country: country.trim() || undefined,
      email: email.trim() || undefined,
    })
  }

  const fieldClass =
    'w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-teal focus:outline-none disabled:opacity-50'

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-2 rounded-2xl rounded-bl-sm bg-white/10 p-3"
    >
      <p className="text-sm font-semibold text-white/90">
        Dejanos tus datos y un agente te contacta 🌿
      </p>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre *"
        disabled={isSubmitting}
        className={fieldClass}
      />
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Teléfono / WhatsApp"
        disabled={isSubmitting}
        className={fieldClass}
      />
      <input
        type="text"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        placeholder="País"
        disabled={isSubmitting}
        className={fieldClass}
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Correo electrónico"
        disabled={isSubmitting}
        className={fieldClass}
      />
      <p className="text-[11px] text-white/40">
        * Nombre y al menos un teléfono o correo.
      </p>
      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="flex-1 rounded-full bg-brand-teal px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-teal/80 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSubmitting ? 'Enviando…' : 'Enviar'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 transition-colors hover:bg-white/5 disabled:opacity-40"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
