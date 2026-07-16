import ReviewCard from './ReviewCard'

/**
 * Sección hero: foto de fondo a pantalla completa con la tarjeta de reseñas.
 * (El ícono del chatbot y el de WhatsApp se renderizan aparte, en FloatingWidgets.)
 */
export default function Hero() {
  return (
    <main
      className="relative flex-grow overflow-hidden bg-brand-dark bg-cover bg-center"
      style={{ backgroundImage: "url('/hero.jpg')" }}
    >
      <ReviewCard />
    </main>
  )
}
