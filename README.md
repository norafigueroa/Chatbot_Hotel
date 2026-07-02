# Isla Chiquita — Landing + Chatbot

Landing page del hotel de glamping **Isla Chiquita** (Golfo de Nicoya, Costa Rica)
con un chatbot funcional impulsado por **OpenRouter** (acceso a modelos de IA, con
modelos **gratuitos** y respaldo automático entre modelos).

Stack: **React 18 + TypeScript + Vite + Tailwind CSS**.

---

## ✨ Características

- **Hero** con foto de fondo a pantalla completa (`public/hero.jpg`) y tarjeta flotante de reseñas.
- **Header** con navegación, logo y CTA de reserva.
- **Chatbot** en modal, con:
  - Ícono ✨ animado en la esquina **inferior derecha**, **arriba** del botón de WhatsApp.
  - Historial de conversación y respuestas **en tiempo real (streaming)**.
  - **Respaldo automático de modelos** (si un modelo falla o está saturado, entra el siguiente).
  - Preguntas sugeridas para arrancar.
  - Respuestas en español, especializadas en transporte, precios, experiencias y bioluminiscencia.
- Botones flotantes de **Privacy** (izquierda) y **WhatsApp** (derecha).
- Diseño responsive (móvil y desktop) con la identidad visual (teal + Montserrat).

---

## 📁 Estructura del proyecto

```
public/
├── hero.jpg                 # Foto de fondo del hero
└── logo.png                 # Logo (favicon)
src/
├── components/
│   ├── Header.tsx            # Encabezado, logo y navegación
│   ├── Hero.tsx              # Sección hero (foto de fondo)
│   ├── ReviewCard.tsx        # Tarjeta flotante de reseñas
│   ├── ChatBot.tsx           # Modal del chatbot (UI + lógica)
│   └── FloatingWidgets.tsx   # Privacy + lanzador ✨ + WhatsApp
├── services/
│   └── chatService.ts        # Integración con OpenRouter (streaming + fallback)
├── types/
│   └── index.ts              # Tipos compartidos (ChatMessage, etc.)
├── utils/
│   └── constants.ts          # Modelos, prompt base y datos de la landing
├── App.tsx                   # Composición de la app
├── main.tsx                  # Punto de entrada de React
└── index.css                 # Tailwind + estilos personalizados
```

---

## 🚀 Setup local

### 1. Requisitos

- Node.js 18+ y npm.
- Una API key de **OpenRouter** (https://openrouter.ai/ → *Keys*). No requiere tarjeta;
  incluye modelos gratuitos.

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar la API key

Copia el archivo de ejemplo y coloca tu key real:

```bash
cp .env.local.example .env.local
```

Edita `.env.local`:

```
VITE_OPENROUTER_API_KEY=sk-or-tu-key-real
```

> `.env.local` está en `.gitignore` y **nunca** se sube a GitHub.

### 4. Levantar el servidor de desarrollo

```bash
npm run dev
```

Abre la URL que muestra Vite (por defecto http://localhost:5173).

### 5. Build de producción

```bash
npm run build      # genera /dist
npm run preview    # previsualiza el build localmente
```

---

## 🤖 Sobre los modelos (OpenRouter)

- Se usa el endpoint compatible con OpenAI (`https://openrouter.ai/api/v1/chat/completions`).
- La lista de modelos vive en `src/utils/constants.ts` (`MODELS`). Se envían como una
  **cadena de respaldo** (máximo 3): si el primero falla o está saturado, OpenRouter
  pasa automáticamente al siguiente.
- Por defecto usa **modelos gratuitos** (`:free`) tipo *instruct* (chat directo), buenos
  en español.
- **Límite gratis:** ~20 peticiones/min y ~50/día por cuenta (compartidas entre modelos).
  Comprar $10 una sola vez sube el límite diario a ~1000 para siempre.
- ⚠️ En hora pico los modelos gratis pueden dar **429 (saturado)**; por eso está el
  respaldo. Si quieres máxima disponibilidad, agrega un modelo de pago barato como
  último respaldo en `MODELS`.

---

## 🔐 Despliegue seguro en producción

> ⚠️ **Importante.** Las variables `VITE_*` se incrustan en el bundle del navegador,
> por lo que la API key **queda visible para cualquier visitante**. Aceptable para un
> prototipo o demo interna, pero **no para producción pública**.

Para producción, mueve la llamada a OpenRouter a una **función serverless** que mantenga
la key en el servidor. En Vercel:

1. Crea `api/chat.ts` (Vercel Serverless Function) que reciba el historial, llame a
   OpenRouter usando `process.env.OPENROUTER_API_KEY` (sin prefijo `VITE_`) y devuelva
   la respuesta (idealmente en streaming).
2. En el frontend, cambia `src/services/chatService.ts` para hacer `fetch('/api/chat', …)`.
3. En Vercel define la variable `OPENROUTER_API_KEY` (**sin** prefijo `VITE_`).

Tip extra: en OpenRouter puedes ponerle un **límite de gasto por key** como red de seguridad.

---

## ☁️ Despliegue en Vercel (prototipo)

1. Sube el repositorio a GitHub.
2. En Vercel: **New Project** → importa el repo.
3. Framework preset: **Vite** (build `npm run build`, output `dist`).
4. Agrega la variable de entorno `VITE_OPENROUTER_API_KEY` (prototipo) o
   `OPENROUTER_API_KEY` (si migras a la función serverless).
5. **Deploy**.

---

## ⚙️ Personalización

- **Modelos / prompt / datos**: `src/utils/constants.ts`.
  - `MODELS` — cadena de respaldo (máx. 3). Cámbialos por IDs de
    https://openrouter.ai/models?max_price=0 (los `:free` son gratis).
  - `SYSTEM_PROMPT` — personalidad y conocimiento del asistente.
  - `WHATSAPP_URL` — reemplaza `50600000000` por el número real del hotel.
- **Colores / fuente**: `tailwind.config.js` (`brand-teal`, Montserrat).
- **Foto del hero**: reemplaza `public/hero.jpg`.
- **Logo / favicon**: `public/logo.png` (favicon) y `src/components/Header.tsx` (logo del header).

---

## 🧠 Notas de implementación

- El chatbot llama a OpenRouter con `fetch` y **streaming** (SSE), sin dependencias pesadas.
- Usa el parámetro `models` (array) para el **respaldo automático** entre modelos.
- La API es **stateless**: se envía el historial completo en cada mensaje.
- Manejo de errores en español (key inválida, saldo, saturación 429, etc.).
- Si falta la API key, la UI del chat muestra un aviso en lugar de fallar en silencio.
