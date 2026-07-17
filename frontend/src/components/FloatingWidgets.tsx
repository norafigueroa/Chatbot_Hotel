import { useState } from 'react'

interface FloatingWidgetsProps {
  chatOpen: boolean
  onToggleChat: () => void
}

/**
 * Widgets fijos en las esquinas inferiores:
 * - Izquierda: botón de Privacy.
 * - Derecha (vertical): lanzador del chatbot ✨ ARRIBA del botón de WhatsApp.
 */
export default function FloatingWidgets({
  chatOpen,
  onToggleChat,
}: FloatingWidgetsProps) {
  const [showTip, setShowTip] = useState(false)

  return (
    <div className="pointer-events-none fixed bottom-0 left-0 right-0 flex items-end justify-between p-4">
      {/* Privacy */}
      <div className="pointer-events-auto">
        <button className="flex items-center gap-2 rounded-sm bg-brand-teal/80 px-4 py-2 text-sm text-white transition-all hover:bg-brand-teal">
          <svg
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            />
          </svg>
          Privacy
        </button>
      </div>

      {/* Stack derecho: chatbot arriba, WhatsApp abajo */}
      <div className="pointer-events-auto flex flex-col items-center gap-3">
        {/* Lanzador del chatbot (con tooltip al pasar el cursor) */}
        <div
          className="relative"
          onMouseEnter={() => setShowTip(true)}
          onMouseLeave={() => setShowTip(false)}
        >
          {/* Tooltip: aparece al pasar el cursor / enfocar la burbuja (chat cerrado) */}
          {!chatOpen && (
            <span
              role="tooltip"
              className={`pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-xl bg-[#1a1a1a] px-3 py-2 text-xs font-medium text-white shadow-xl ring-1 ring-white/10 transition-all duration-200 ${
                showTip ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0'
              }`}
            >
              ¿Necesitás ayuda? Chateá conmigo 🌿
            </span>
          )}
        <button
          onClick={onToggleChat}
          onFocus={() => setShowTip(true)}
          onBlur={() => setShowTip(false)}
          aria-label={chatOpen ? 'Cerrar chat' : 'Abrir chat'}
          aria-expanded={chatOpen}
          className={`flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform duration-300 hover:scale-110 ${
            chatOpen ? 'bg-brand-teal' : ''
          }`}
        >
          {chatOpen ? (
            <svg
              className="h-7 w-7 text-white"
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
          ) : (
            <img
              src="/Burbuja.png"
              alt=""
              aria-hidden="true"
              className="h-14 w-14 animate-pulse-glow object-contain drop-shadow-lg"
            />
          )}
        </button>
        </div>

        {/* WhatsApp */}
        {/* Solo visual: la página es una maqueta, no redirige a WhatsApp. */}
        <div className="block" aria-hidden="true">
          <svg
            className="h-14 w-14 drop-shadow-lg"
            fill="#25D366"
            viewBox="0 0 448 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.2-8.5-44.2-27.1-16.4-14.6-27.4-32.7-30.6-38.2-3.2-5.5-.3-8.5 2.4-11.2 2.5-2.6 5.5-6.5 8.3-9.7 2.8-3.3 3.7-5.5 5.5-9.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.5 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
          </svg>
        </div>
      </div>
    </div>
  )
}
