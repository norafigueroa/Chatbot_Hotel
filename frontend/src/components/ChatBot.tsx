import { useEffect, useRef, useState } from 'react'
import type { ChatMessage } from '../types'
import { streamChatResponse, submitLead, type LeadData } from '../services/chatService'
import {
  SUGGESTED_QUESTIONS,
  WELCOME_MESSAGE,
  type SuggestionIcon,
} from '../utils/constants'
import ChatMarkdown from './ChatMarkdown'
import LeadForm from './LeadForm'

interface ChatBotProps {
  isOpen: boolean
  onClose: () => void
}

/** Genera un id único simple para cada mensaje. */
function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

/** Hora fija de envío, ej. "10:42 p. m." */
function nowTime(): string {
  return new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })
}

/** Íconos para las preguntas sugeridas. */
function ChipIcon({ name }: { name: SuggestionIcon }) {
  const props = {
    className: 'h-4 w-4 shrink-0',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    viewBox: '0 0 24 24',
    xmlns: 'http://www.w3.org/2000/svg',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  if (name === 'map') {
    return (
      <svg {...props}>
        <path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    )
  }
  if (name === 'tent') {
    return (
      <svg {...props}>
        <path d="M12 4 3 20h18L12 4z" />
        <path d="M12 4v16" />
      </svg>
    )
  }
  return (
    <svg {...props}>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
    </svg>
  )
}

/** Avatar del asistente (junto a sus mensajes). */
function BotAvatar() {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-teal/10">
      <img src="/Logo_Modal.png" alt="" aria-hidden="true" className="h-6 w-6 object-contain" />
    </div>
  )
}

/** Modal del chatbot con historial de conversación y respuestas en tiempo real. */
export default function ChatBot({ isOpen, onClose }: ChatBotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'assistant', content: WELCOME_MESSAGE, time: nowTime() },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Captura de datos de contacto (leads).
  const [leadOpen, setLeadOpen] = useState(false)
  const [leadSubmitting, setLeadSubmitting] = useState(false)
  const [leadDone, setLeadDone] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll al último mensaje cuando cambia el historial.
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, isLoading, leadOpen, leadDone])

  // Enfocar el input al abrir el chat.
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  async function sendMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return

    setError(null)

    const userMessage: ChatMessage = {
      id: createId(),
      role: 'user',
      content: trimmed,
      time: nowTime(),
    }

    // El id del mensaje del asistente que se irá llenando por streaming.
    const assistantId = createId()

    const history = [...messages, userMessage]
    setMessages([
      ...history,
      { id: assistantId, role: 'assistant', content: '', time: nowTime() },
    ])
    setInput('')
    setIsLoading(true)

    try {
      await streamChatResponse(history, (delta) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + delta } : m,
          ),
        )
      })
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Ocurrió un error inesperado. Intenta de nuevo.'
      setError(message)
      // Elimina la burbuja vacía del asistente si no llegó a llenarse.
      setMessages((prev) =>
        prev.filter((m) => !(m.id === assistantId && m.content === '')),
      )
    } finally {
      setIsLoading(false)
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    void sendMessage(input)
  }

  /** Arma un resumen breve de la conversación para dar contexto al hotel. */
  function buildConversationSummary(): string {
    return messages
      .filter((m) => m.id !== 'welcome' && m.content.trim())
      .slice(-8)
      .map((m) => `${m.role === 'user' ? 'Cliente' : 'Bot'}: ${m.content}`)
      .join('\n')
      .slice(0, 1500)
  }

  async function handleLeadSubmit(data: LeadData) {
    setError(null)
    setLeadSubmitting(true)
    try {
      await submitLead({ ...data, conversation: buildConversationSummary() })
      setLeadOpen(false)
      setLeadDone(true)
      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: 'assistant',
          content:
            '¡Gracias! 🌿 Recibimos tus datos. Un agente del hotel te contactará pronto en horario de oficina. ¿Puedo ayudarte con algo más?',
          time: nowTime(),
        },
      ])
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No pudimos enviar tus datos. Intentá de nuevo.',
      )
    } finally {
      setLeadSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="pointer-events-auto fixed bottom-24 right-4 z-[60] flex h-[70vh] max-h-[560px] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl sm:bottom-28 sm:right-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between border-b border-black/5 bg-gradient-to-b from-brand-teal/20 to-white px-4 py-3">
        <div className="flex items-center gap-2">
          <img
            src="/Logo_Modal.png"
            alt=""
            aria-hidden="true"
            className="h-11 w-11 shrink-0 object-contain"
          />
          <div>
            <p className="text-sm font-bold leading-tight text-brand-teal">Isla Chiquita</p>
            <p className="text-[10px] uppercase tracking-wider text-gray-500">
              Asistente virtual
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 transition-colors hover:text-gray-700"
          aria-label="Cerrar chat"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 18L18 6M6 6l12 12"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </button>
      </div>

      {/* Historial */}
      <div
        ref={scrollRef}
        className="chat-scroll flex-1 space-y-3 overflow-y-auto bg-[#faf9f6] p-4"
      >
        {messages.map((message) => {
          const isUser = message.role === 'user'
          return (
            <div
              key={message.id}
              className={`flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`flex max-w-[90%] items-end gap-2 ${
                  isUser ? 'flex-row-reverse' : ''
                }`}
              >
                {!isUser && <BotAvatar />}
                <div
                  className={`break-words rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    isUser
                      ? 'whitespace-pre-wrap rounded-br-sm bg-black/5 text-gray-800'
                      : 'rounded-bl-sm bg-brand-teal text-white'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    message.content ? (
                      <ChatMarkdown content={message.content} />
                    ) : isLoading ? (
                      <span className="inline-flex gap-1">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/70 [animation-delay:-0.3s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/70 [animation-delay:-0.15s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/70" />
                      </span>
                    ) : (
                      ''
                    )
                  ) : (
                    message.content
                  )}
                </div>
              </div>
              {message.content.trim() && message.time && (
                <span className="px-1 text-[10px] text-gray-400">{message.time}</span>
              )}
            </div>
          )
        })}

        {/* Preguntas sugeridas (solo al inicio) */}
        {messages.length === 1 && !isLoading && (
          <div className="flex flex-wrap gap-2 pt-1">
            {SUGGESTED_QUESTIONS.map((s) => (
              <button
                key={s.label}
                onClick={() => void sendMessage(s.question)}
                className="flex items-center gap-1.5 rounded-full border border-brand-teal/40 bg-white px-3 py-1.5 text-xs font-medium text-brand-teal transition-colors hover:bg-brand-teal/10"
              >
                <ChipIcon name={s.icon} />
                {s.label}
              </button>
            ))}
          </div>
        )}

        {/* Formulario de captura de datos (leads) */}
        {leadOpen && (
          <LeadForm
            onSubmit={handleLeadSubmit}
            onCancel={() => setLeadOpen(false)}
            isSubmitting={leadSubmitting}
          />
        )}

        {error && (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 ring-1 ring-red-200">
            {error}
          </div>
        )}
      </div>

      {/* CTA para dejar datos de contacto */}
      {!leadOpen && !leadDone && (
        <button
          onClick={() => setLeadOpen(true)}
          className="flex items-center justify-center gap-1.5 border-t border-black/5 px-4 py-2.5 text-xs font-medium text-brand-teal transition-colors hover:bg-brand-teal/5"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
          ¿Querés que te contactemos? Dejá tus datos
        </button>
      )}

      {/* Entrada de texto */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t border-black/5 bg-white p-3"
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu pregunta..."
          disabled={isLoading}
          className="flex-1 rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-teal focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-teal text-white transition-colors hover:bg-brand-teal/80 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Enviar mensaje"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 12h14M12 5l7 7-7 7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </button>
      </form>

      {/* Footer de marca */}
      <p className="bg-white pb-2 text-center text-[9px] font-medium uppercase tracking-widest text-gray-400">
        Powered by Isla Chiquita Experience
      </p>
    </div>
  )
}
