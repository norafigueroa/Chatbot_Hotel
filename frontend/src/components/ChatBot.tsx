import { useEffect, useRef, useState } from 'react'
import type { ChatMessage } from '../types'
import { streamChatResponse, submitLead, type LeadData } from '../services/chatService'
import { SUGGESTED_QUESTIONS, WELCOME_MESSAGE } from '../utils/constants'
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

/** Modal del chatbot con historial de conversación y respuestas en tiempo real. */
export default function ChatBot({ isOpen, onClose }: ChatBotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'assistant', content: WELCOME_MESSAGE },
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
    }

    // El id del mensaje del asistente que se irá llenando por streaming.
    const assistantId = createId()

    const history = [...messages, userMessage]
    setMessages([
      ...history,
      { id: assistantId, role: 'assistant', content: '' },
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
    <div className="pointer-events-auto fixed bottom-24 right-4 z-[60] flex h-[70vh] max-h-[560px] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-lg border border-white/10 bg-[#1a1a1a] shadow-2xl sm:right-6 sm:bottom-28">
      {/* Encabezado */}
      <div className="flex items-center justify-between bg-brand-teal px-4 py-3">
        <div className="flex items-center gap-2">
          <img
            src="/Logo_Modal.png"
            alt=""
            aria-hidden="true"
            className="h-12 w-12 shrink-0 object-contain"
          />
          <div>
            <p className="text-sm font-bold leading-tight">Isla Chiquita</p>
            <p className="text-[10px] uppercase tracking-wider text-white/70">
              Asistente virtual
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 transition-colors hover:text-white"
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
        className="chat-scroll flex-1 space-y-3 overflow-y-auto p-4"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[85%] break-words rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                message.role === 'user'
                  ? 'whitespace-pre-wrap rounded-br-sm bg-brand-teal text-white'
                  : 'rounded-bl-sm bg-white/10 text-white/90'
              }`}
            >
              {message.role === 'assistant' ? (
                message.content ? (
                  <ChatMarkdown content={message.content} />
                ) : isLoading ? (
                  <span className="inline-flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/60 [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/60 [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/60" />
                  </span>
                ) : (
                  ''
                )
              ) : (
                message.content
              )}
            </div>
          </div>
        ))}

        {/* Preguntas sugeridas (solo al inicio) */}
        {messages.length === 1 && !isLoading && (
          <div className="flex flex-wrap gap-2 pt-2">
            {SUGGESTED_QUESTIONS.map((question) => (
              <button
                key={question}
                onClick={() => void sendMessage(question)}
                className="rounded-full border border-brand-teal/60 px-3 py-1.5 text-xs text-white/80 transition-colors hover:bg-brand-teal/30"
              >
                {question}
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
          <div className="rounded-lg bg-red-500/20 px-3 py-2 text-xs text-red-200">
            {error}
          </div>
        )}
      </div>

      {/* CTA para dejar datos de contacto */}
      {!leadOpen && !leadDone && (
        <button
          onClick={() => setLeadOpen(true)}
          className="border-t border-white/10 bg-brand-teal/15 px-4 py-2 text-xs font-medium text-brand-teal transition-colors hover:bg-brand-teal/25"
        >
          📋 ¿Querés que te contactemos? Dejá tus datos
        </button>
      )}

      {/* Entrada de texto */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t border-white/10 p-3"
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu pregunta..."
          disabled={isLoading}
          className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-teal focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-teal transition-colors hover:bg-brand-teal/80 disabled:cursor-not-allowed disabled:opacity-40"
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
    </div>
  )
}
