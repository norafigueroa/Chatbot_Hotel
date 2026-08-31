import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import FloatingWidgets from './components/FloatingWidgets'
import ChatBot from './components/ChatBot'

/**
 * Header, Hero y ReviewCard son una landing de REFERENCIA VISUAL únicamente
 * (generada como mockup): sirve para que quien la vea se ubique y entienda
 * cómo se ve el widget del chat ya integrado a un sitio, pero no es el sitio
 * real del hotel (islachiquitacostarica.com) ni algo que haya que integrar.
 * Lo único funcional acá, y lo que sí es el entregable, es el widget del chat:
 * FloatingWidgets (ícono) + ChatBot (modal) + el backend en api/ y backend/.
 */
export default function App() {
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Hero />

      <FloatingWidgets
        chatOpen={chatOpen}
        onToggleChat={() => setChatOpen((open) => !open)}
      />
      <ChatBot isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  )
}
