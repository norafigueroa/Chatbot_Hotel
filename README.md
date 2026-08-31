# Isla Chiquita — Chatbot

Backend + widget de chatbot para **Isla Chiquita Glamping Hotel** (Golfo de Nicoya,
Costa Rica), impulsado por IA (Claude / Anthropic).

Stack: **React 18 + TypeScript + Vite + Tailwind CSS** (frontend) y **funciones
serverless de Vercel** (backend).

---

## ⚠️ Qué es cada parte de este repo

Este repositorio tiene dos partes con roles muy distintos:

1. **El entregable real**: el widget del chat (ícono + modal) y todo el backend
   que lo hace funcionar (`api/`, `backend/`). Esto es lo que hay que integrar
   al sitio real del hotel.
2. **Una landing de referencia visual** (`Header`, `Hero`, `ReviewCard` en
   `frontend/src/components/`): es un **mockup**, no el sitio real del hotel
   (que es islachiquitacostarica.com, administrado por otro equipo). Se armó
   únicamente para que quien lo vea se ubique y entienda cómo luce el widget
   del chat ya funcionando sobre un sitio. Todos sus botones y links (menú,
   "Book Now", Privacy, WhatsApp) son decorativos y no hacen nada — **el único
   elemento funcional de toda la pantalla es el ícono del chat**, que abre el
   modal real.

Si estás integrando esto a la página del hotel, no hace falta que repliques
Header/Hero/ReviewCard: lo que necesitás es el widget del chat y el backend.

---

## 📁 Estructura del proyecto

```
frontend/                # Landing de referencia visual + widget del chat
├── index.html
├── public/               # Assets estáticos (logo, hero.jpg, íconos)
└── src/
    ├── components/
    │   ├── Header.tsx, Hero.tsx, ReviewCard.tsx   # Landing de referencia (mockup)
    │   ├── FloatingWidgets.tsx                    # Ícono del chat (único elemento funcional del fondo)
    │   ├── ChatBot.tsx                            # Modal del chat: UI + lógica + leads
    │   ├── ChatMarkdown.tsx                       # Renderiza las respuestas del bot (Markdown seguro)
    │   └── LeadForm.tsx                           # Mini-formulario de contacto dentro del chat
    ├── services/chatService.ts                    # Llama a /api/chat y /api/lead (streaming)
    ├── types/index.ts                             # Tipos compartidos
    ├── utils/constants.ts                         # Mensaje de bienvenida + preguntas sugeridas
    ├── App.tsx, main.tsx, index.css

api/                      # Entry points de Vercel (Edge Functions), delgados
├── chat.ts                # POST /api/chat  → arma el prompt y llama al proveedor de IA (streaming)
└── lead.ts                 # POST /api/lead  → guarda el lead en Supabase + notifica por correo

backend/
├── lib/
│   ├── llm.ts              # Adaptador de proveedor de IA (OpenRouter ↔ Anthropic/Claude)
│   ├── knowledge.ts         # Personalidad del bot + arma el prompt con las FAQs
│   ├── supabase.ts          # Acceso a Supabase (FAQs + leads) vía REST, sin SDK
│   ├── email.ts             # Notificación de leads por correo (Resend)
│   └── weather.ts           # Clima en vivo (OpenWeather), inyectado al prompt cuando aplica
├── db/
│   ├── schema.sql           # Esquema de Supabase (tablas + RLS)
│   └── faqs.seed.ts         # Base de conocimiento (FAQs) y respaldo local si Supabase no responde
└── scripts/seed.mjs         # Carga/actualiza las FAQs de faqs.seed.ts en Supabase

dev/api-middleware.ts     # SOLO desarrollo: sirve api/ dentro de `npm run dev` (Vite)
```

---

## 🚀 Setup local

### 1. Requisitos

- Node.js 18+ y npm.
- Cuenta y proyecto en **Supabase** (base de datos de FAQs y leads).
- Una API key de IA: **Anthropic (Claude)** para el entregable final, u
  **OpenRouter** si se quiere probar con modelos gratuitos.
- Opcional: cuenta de **Resend** (correo de leads) y **OpenWeather** (clima en vivo).

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.local.example .env.local
```

Completá `.env.local` con tus valores reales (ver comentarios dentro del
archivo para el detalle de cada variable). Resumen:

| Variable | Para qué sirve |
|---|---|
| `LLM_PROVIDER` | `anthropic` (Claude, final) u `openrouter` (prototipo, gratis) |
| `ANTHROPIC_API_KEY` / `ANTHROPIC_MODEL` | Credenciales de Claude |
| `OPENROUTER_API_KEY` | Credenciales de OpenRouter (si se usa ese proveedor) |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Base de datos (FAQs + leads) |
| `RESEND_API_KEY` / `LEAD_EMAIL_TO` | Notificación por correo de cada lead |
| `OPENWEATHER_API_KEY` / `WEATHER_LAT` / `WEATHER_LON` | Clima en vivo de la isla |

> `.env.local` está en `.gitignore` y **nunca** se sube a GitHub.

### 4. Base de datos (Supabase)

1. En el SQL Editor de Supabase, corré `backend/db/schema.sql` (crea las
   tablas `faqs` y `leads`, con sus políticas de seguridad).
2. Cargá las FAQs iniciales:

```bash
npm run seed
```

Este comando es idempotente: se puede correr las veces que haga falta para
actualizar las FAQs (por ejemplo, después de editar `backend/db/faqs.seed.ts`).

### 5. Levantar el servidor de desarrollo

```bash
npm run dev
```

Un plugin de Vite (`dev/api-middleware.ts`) sirve `api/` dentro del mismo
servidor, así que `npm run dev` levanta frontend **y** backend juntos —no
hace falta `vercel dev`. Abrí la URL que muestra Vite (por defecto
http://localhost:5173).

### 6. Build de producción

```bash
npm run build      # genera /dist
npm run preview    # previsualiza el build localmente
```

---

## ☁️ Despliegue

Pensado para **Vercel**: `vercel.json` define `buildCommand: npm run build` y
`outputDirectory: dist`. Las funciones de `api/` corren como Edge Functions.
Configurá en Vercel las mismas variables de entorno de `.env.local.example`
(sin prefijo `VITE_`, esas nunca llegan al navegador).

---

## ⚙️ Personalización

- **Personalidad y reglas del bot**: `backend/lib/knowledge.ts` (`PERSONA`).
- **Base de conocimiento (FAQs)**: `backend/db/faqs.seed.ts`. Después de
  editarla, correr `npm run seed` para actualizar Supabase.
- **Mensaje de bienvenida / preguntas sugeridas del chat**:
  `frontend/src/utils/constants.ts`.
- **Colores / fuente**: `tailwind.config.js` (`brand-teal`, Montserrat).
- **Landing de referencia**: `frontend/src/components/Header.tsx`,
  `Hero.tsx`, `ReviewCard.tsx` — recordá que es solo un mockup visual (ver
  arriba), no requiere mantenimiento fino.

---

## 🧠 Notas de implementación

- El chat responde en **streaming** (texto plano desde `/api/chat`), sin SSE
  ni dependencias pesadas.
- `backend/lib/llm.ts` reintenta automáticamente si el modelo devuelve una
  respuesta vacía (hasta 3 intentos); los errores reales (401, 402, 429...)
  nunca se reintentan.
- La API es **stateless**: el frontend envía el historial completo en cada
  mensaje.
- Los leads se guardan primero en Supabase (fuente de verdad); el correo de
  notificación es best-effort y no bloquea la respuesta al usuario.
- Si Supabase no responde, el bot sigue funcionando con el respaldo local de
  FAQs (`backend/db/faqs.seed.ts`), aunque los leads no se guardan mientras
  tanto.
