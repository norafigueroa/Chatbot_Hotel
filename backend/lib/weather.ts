/**
 * Clima en vivo para Isla Chiquita (Isla Jesusita, frente a Paquera, Golfo de
 * Nicoya) vía OpenWeather.
 *
 * Estrategia: el backend detecta si la pregunta es sobre el clima y, solo en ese
 * caso, consulta el clima actual y se lo pasa al modelo como dato real. Así el
 * bot no inventa el clima y lo redacta con su tono.
 *
 * Variables de entorno (servidor, secretas):
 *   OPENWEATHER_API_KEY  -> requerida para activar el clima.
 *   WEATHER_LAT / WEATHER_LON -> opcionales, para ajustar la ubicación.
 *
 * Si falta la key o la API falla, devuelve null y el bot responde de forma
 * genérica (nunca rompe).
 */

const KEY = process.env.OPENWEATHER_API_KEY
// Coordenadas aproximadas de Isla Jesusita / Paquera, Puntarenas.
const LAT = process.env.WEATHER_LAT ?? '9.82'
const LON = process.env.WEATHER_LON ?? '-84.93'

const CACHE_MS = 15 * 60 * 1000 // 15 minutos
let cache: { text: string; at: number } | null = null

/** ¿La pregunta del usuario es sobre el clima? */
export function isWeatherQuery(text: string): boolean {
  return /\b(clima|tiempo|temperatura|grados|lluvia|llueve|llover|lloviendo|calor|fr[ií]o|soleado|sol|nublado|weather|forecast|pron[oó]stico|rain|raining|temperature|sunny|hot|cold|humidity|humedad)\b/i.test(
    text,
  )
}

/**
 * Devuelve una frase con el clima actual de Isla Chiquita, o null si no está
 * configurado o falla. Cachea el resultado ~15 min.
 */
export async function getWeatherContext(signal?: AbortSignal): Promise<string | null> {
  if (!KEY) return null

  const now = Date.now()
  if (cache && now - cache.at < CACHE_MS) return cache.text

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=metric&lang=es&appid=${KEY}`
    const res = await fetch(url, { signal })
    if (!res.ok) return null

    const d: any = await res.json()
    const temp = Math.round(d?.main?.temp)
    const feels = Math.round(d?.main?.feels_like)
    const desc: string = d?.weather?.[0]?.description ?? ''
    const humidity = d?.main?.humidity

    if (Number.isNaN(temp)) return null

    const parts = [`${temp}°C`]
    if (!Number.isNaN(feels) && feels !== temp) parts.push(`sensación ${feels}°C`)
    if (desc) parts.push(desc)
    if (typeof humidity === 'number') parts.push(`humedad ${humidity}%`)

    const text = `Clima actual en Isla Chiquita: ${parts.join(', ')}.`
    cache = { text, at: now }
    return text
  } catch {
    return null
  }
}
