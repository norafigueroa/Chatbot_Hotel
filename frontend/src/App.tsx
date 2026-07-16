import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import FloatingWidgets from './components/FloatingWidgets'
import ChatBot from './components/ChatBot'

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
