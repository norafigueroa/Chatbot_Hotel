const LOGO_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBy37E4ObTpoRhkeWQWZh1LpaM8PbwkCYOOZp59J2ywsYNTsFz57vP-gVrwU5UDTSOPpy6mgpY5VlCS2rhN8HGeM8hAd5E45ljNceOZcVuSJp2tJmP9Zk8pkMLiAdlJFcND_fVhAVrE3GrWnTbIGhmRNpJrsr4L8pzYcX3iGMuLX3wD12upxpwrzqTXOdZ_EjZ2qMpjOMg8vf95u2m-yaIroUypUsusdpRGr-Jcc_BWwYNOaFxXWEuABP5dkSnAsNHvHg'

const NAV_ITEMS = ['Our Tents', 'Specials', 'Experiences', 'Eat & Drink']

/** Encabezado principal con logo, navegación y CTA de reserva. */
export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-brand-teal px-6 py-3">
      {/* Logo e idioma */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <img
            src={LOGO_URL}
            alt="Isla Chiquita Logo"
            className="logo-black h-20"
          />
        </div>
        <div className="hidden items-center text-xs font-semibold tracking-widest text-white/90 md:flex">
          EN <span className="ml-1">▼</span>
        </div>
      </div>

      {/* Navegación central */}
      <nav className="hidden items-center gap-8 text-xs font-bold uppercase tracking-widest text-white lg:flex">
        {NAV_ITEMS.map((item) => (
          <a key={item} href="#" className="flex items-center hover:opacity-70">
            {item}
            {item === 'Our Tents' && (
              <span className="ml-1 text-[8px]">▼</span>
            )}
          </a>
        ))}
      </nav>

      {/* Acciones a la derecha */}
      <div className="flex items-center gap-6">
        {/* Menú móvil */}
        <button className="text-white lg:hidden" aria-label="Abrir menú">
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6h16M4 12h16m-7 6h7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </button>

        {/* Ícono hamburguesa desktop */}
        <div className="hidden cursor-pointer lg:block">
          <svg
            width="35"
            height="20"
            viewBox="0 0 35 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="35" height="2.5" fill="white" />
            <rect y="8.75" width="35" height="2.5" fill="white" />
            <rect y="17.5" width="35" height="2.5" fill="white" />
          </svg>
        </div>

        <button className="bg-[#242d2d] px-8 py-3 text-sm font-bold uppercase tracking-widest transition-colors hover:bg-black">
          Book Now
        </button>
      </div>
    </header>
  )
}
