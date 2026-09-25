import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import FloatingWidgets from './components/FloatingWidgets'
import ChatBot from './components/ChatBot'
// La consulta "?inline" hace que Vite entregue el CSS ya compilado (Tailwind
// incluido) como un string de JS, para inyectarlo dentro del Shadow DOM.
import widgetCss from './index.css?inline'

/**
 * Punto de entrada del WIDGET EMBEBIBLE (build separado, ver vite.widget.config.ts).
 *
 * A diferencia de main.tsx (que monta toda la landing de demo dentro de un
 * <div id="root"> que ya existe en index.html), este script se auto-instala
 * solo: crea su propio contenedor, lo agrega al final de <body>, y monta ahí
 * SOLO el ícono flotante + el modal del chat — nada de Header/Hero/ReviewCard.
 *
 * Usa Shadow DOM para que los estilos del sitio anfitrión (el sitio real del
 * hotel) nunca choquen con los del widget, en ningún sentido.
 */
function WidgetApp() {
  const [chatOpen, setChatOpen] = useState(false)
  return (
    <>
      <FloatingWidgets
        embedded
        chatOpen={chatOpen}
        onToggleChat={() => setChatOpen((open) => !open)}
      />
      <ChatBot isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  )
}

function mount() {
  // Evita montar dos veces si el script se carga más de una vez por error.
  if (document.getElementById('isla-chiquita-chat-widget')) return

  const host = document.createElement('div')
  host.id = 'isla-chiquita-chat-widget'
  document.body.appendChild(host)

  const shadow = host.attachShadow({ mode: 'open' })

  const style = document.createElement('style')
  style.textContent = widgetCss
  shadow.appendChild(style)

  const mountPoint = document.createElement('div')
  shadow.appendChild(mountPoint)

  createRoot(mountPoint).render(<WidgetApp />)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount)
} else {
  mount()
}
