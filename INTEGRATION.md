# Guía de integración — Chatbot Isla Chiquita

Este documento es para el equipo que va a integrar el chatbot al sitio real
de Isla Chiquita (islachiquitacostarica.com). Explica qué se entrega, cómo
está armado, y las dos formas posibles de integrarlo según el stack del
sitio.

---

## 1. Qué se entrega

Dos piezas, independientes entre sí:

1. **El backend** (`api/` + `backend/`): funciones serverless que reciben los
   mensajes del chat, arman la respuesta con IA (Claude/Anthropic) usando la
   base de conocimiento del hotel, y guardan los datos de contacto (leads)
   que dejan los visitantes. Esto **siempre** hay que desplegarlo, sin
   importar el stack del sitio.
2. **El widget de chat** (ícono + ventana de chat): la parte visual con la
   que interactúa el usuario. Está construido en React, pero **no es
   obligatorio usar ese código tal cual** — más abajo se explican las dos
   rutas posibles.

> ⚠️ El resto del repositorio (`frontend/src/components/Header.tsx`,
> `Hero.tsx`, `ReviewCard.tsx`) es una landing de **referencia visual**
> (mockup), no el sitio real del hotel. No hace falta integrarla ni tomarla
> en cuenta — solo sirve para ver el widget funcionando en contexto.

---

## 2. Cómo funciona (arquitectura)

```
Usuario escribe en el chat
        │
        ▼
Widget (React, o su equivalente si se reimplementa)
        │  POST /api/chat   { messages: [...] }
        ▼
Backend (Vercel Edge Function)
        │  arma el prompt: personalidad + FAQs (desde Supabase)
        │  + clima en vivo si la pregunta es sobre el clima
        ▼
Proveedor de IA (Claude / Anthropic)
        │  responde en streaming
        ▼
Backend devuelve el texto en streaming (texto plano, no SSE)
        │
        ▼
Widget muestra la respuesta a medida que llega
```

Cuando el usuario deja sus datos de contacto:

```
Widget  →  POST /api/lead  { name, phone?, country?, email?, conversation? }
                │
                ├─→ se guarda en Supabase (tabla `leads`) — fuente de verdad
                └─→ se envía un correo de notificación (Resend) — best-effort,
                    si falla el correo el lead ya quedó guardado igual
```

---

## 3. Desplegar el backend

El backend está pensado para **Vercel** (Edge Functions), que es como se
desarrolló y probó. Requiere:

- Node/runtime compatible con Edge (soporte de `fetch`, `Response`,
  `ReadableStream` — estándares Web, no APIs específicas de Node).
- Las variables de entorno de la sección 4.

Si el equipo de integración va a alojar el backend en otro lado (no Vercel),
los archivos `api/chat.ts` y `api/lead.ts` son el punto de entrada — reciben
un `Request` (Web estándar) y devuelven un `Response`. Se pueden adaptar a
cualquier runtime que soporte ese contrato (por ejemplo, Cloudflare Workers,
o un wrapper en Node/Express que traduzca req/res a Request/Response, similar
a lo que hace `dev/api-middleware.ts` para el entorno de desarrollo local).

---

## 4. Variables de entorno necesarias

Ninguna key real va en este documento (ver nota de seguridad al final).
Estas son las variables que hay que configurar donde se despliegue el
backend:

| Variable | Para qué sirve | De dónde se obtiene |
|---|---|---|
| `LLM_PROVIDER` | Cuál IA usar. Valor: `anthropic` | — (es texto fijo, no una key) |
| `ANTHROPIC_API_KEY` | Key de Claude | console.anthropic.com (cuenta del hotel) |
| `ANTHROPIC_MODEL` | Modelo de Claude a usar | Valor fijo, ej. `claude-sonnet-5` |
| `SUPABASE_URL` | URL del proyecto de base de datos | Supabase → Project Settings → API (cuenta del hotel) |
| `SUPABASE_SERVICE_ROLE_KEY` | Key secreta de Supabase (acceso total al servidor) | Igual que arriba — **nunca** exponer al navegador |
| `RESEND_API_KEY` | Envío de correo de notificación de leads | resend.com (cuenta del hotel) |
| `LEAD_EMAIL_TO` | Correo que recibe la notificación de cada lead | Definido por el hotel |
| `LEAD_EMAIL_FROM` | (Opcional) remitente del correo | Requiere dominio verificado en Resend |
| `OPENWEATHER_API_KEY` | Clima en vivo de la isla | openweathermap.org (cuenta del hotel) |
| `WEATHER_LAT` / `WEATHER_LON` | Coordenadas de la isla | `9.82` / `-84.93` (no son secretas, se pueden dejar así) |

`.env.local.example` en la raíz del repo tiene el detalle de cada una con
comentarios.

---

## 5. Integrar el widget — dos rutas

### Ruta A — El sitio ya usa React

Se pueden tomar directo estos componentes de `frontend/src/components/`:

- `FloatingWidgets.tsx` — el ícono flotante que abre/cierra el chat.
- `ChatBot.tsx` — el modal del chat (historial, input, formulario de leads).
- `ChatMarkdown.tsx` y `LeadForm.tsx` — usados internamente por `ChatBot.tsx`.

Dependencias necesarias (ver `package.json`): `react-markdown`, `remark-gfm`,
`remark-breaks`. Los estilos usan Tailwind CSS (`tailwind.config.js` tiene
los colores de marca `brand-teal`).

`frontend/src/services/chatService.ts` es la capa que llama a `/api/chat` y
`/api/lead` — si el backend queda en un dominio distinto al del sitio,
configurar `VITE_API_BASE` (o el equivalente en su bundler) con la URL del
backend.

### Ruta B — El sitio NO usa React (o se prefiere reimplementar la UI)

En este caso, el backend (`/api/chat` y `/api/lead`) se puede consumir desde
cualquier tecnología, ya que son endpoints HTTP simples. El "contrato" es:

**`POST /api/chat`**

Request:
```json
{
  "messages": [
    { "role": "user", "content": "¿Cómo llego al hotel?" },
    { "role": "assistant", "content": "..." },
    { "role": "user", "content": "¿Y cuánto cuesta el pase del día?" }
  ]
}
```
- Enviar el historial completo en cada llamada (la API es stateless).
- El primer mensaje del arreglo debe ser de `role: "user"`.

Response: `200 OK`, `Content-Type: text/plain`, cuerpo en **streaming** (el
texto de la respuesta va llegando en fragmentos, no es JSON ni SSE — es
texto plano acumulable). Si el asistente quiere ofrecer el formulario de
contacto, termina su respuesta con el token literal `[[LEAD_FORM]]`, que la
UI debe interpretar (mostrar un botón/formulario) y **nunca mostrar tal
cual** al usuario.

Errores: `4xx`/`5xx` con JSON `{ "error": "mensaje en español, listo para mostrar" }`.

**`POST /api/lead`**

Request:
```json
{
  "name": "Juan Pérez",
  "phone": "+506 8888 7777",
  "country": "Costa Rica",
  "email": "juan@correo.com",
  "conversation": "resumen opcional de la charla, texto libre"
}
```
- `name` y al menos uno de `phone`/`email` son obligatorios.

Response: `200 OK` con `{ "ok": true }`, o error igual que arriba.

---

## 6. Base de conocimiento (FAQs)

Las respuestas del bot salen de la tabla `faqs` en Supabase. Para
actualizarlas:

1. Editar `backend/db/faqs.seed.ts` (agregar/editar preguntas).
2. Correr `npm run seed` — sincroniza ese archivo con Supabase (es
   idempotente, se puede correr las veces que haga falta).

No se recomienda editar las FAQs directo en la tabla de Supabase sin
reflejarlo también en `faqs.seed.ts`, porque ese archivo es además el
respaldo local que usa el bot si Supabase no responde.

---

## 7. Seguridad — cómo se transfieren las keys reales

Las keys reales (Anthropic, Supabase, Resend, OpenWeather) **no viajan en
este documento**. Se transfieren directamente a quien vaya a configurar el
despliegue, por un canal controlado (ideal: cargarlas directo en las
variables de entorno del hosting elegido — por ejemplo Vercel → Project
Settings → Environment Variables — o mediante un gestor de contraseñas
compartido). Ante cualquier duda sobre esto, contactar al equipo de
desarrollo antes de mover las keys por correo o chat sin cifrar.

---

## 8. Contacto

Ante dudas técnicas sobre esta integración, contactar al equipo de
desarrollo que armó el chatbot.
