/**
 * Carga (o actualiza) las FAQs del archivo db/faqs.seed.ts en la tabla `faqs`
 * de Supabase. Es idempotente: usa "upsert" sobre la columna `ref`, así que
 * podés correrlo las veces que quieras sin duplicar.
 *
 * Requisitos:
 *   - Haber ejecutado db/schema.sql en Supabase.
 *   - Variables de entorno (podés ponerlas en .env.local):
 *       SUPABASE_URL
 *       SUPABASE_SERVICE_ROLE_KEY   (la SECRETA, no la anon)
 *
 * Uso:
 *   node scripts/seed.mjs
 *
 * (Node 24 ejecuta TypeScript directamente, por eso puede importar el .ts.)
 */

import { readFileSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..', '..') // backend/scripts -> raíz del repo
const dbDir = join(__dirname, '..', 'db') // backend/db

// Carga simple de .env.local (sin dependencias).
try {
  const env = readFileSync(join(root, '.env.local'), 'utf8')
  for (const line of env.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
} catch {
  /* sin .env.local: se usan las variables del entorno */
}

const URL = process.env.SUPABASE_URL
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!URL || !KEY) {
  console.error('❌ Faltan SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY.')
  console.error('   Ponelas en .env.local y volvé a correr: node backend/scripts/seed.mjs')
  process.exit(1)
}

const { FAQS } = await import(pathToFileURL(join(dbDir, 'faqs.seed.ts')).href)
console.log(`Cargando ${FAQS.length} FAQs a Supabase…`)

const rows = FAQS.map((f) => ({
  ref: f.ref,
  category: f.category,
  question: f.question,
  answer: f.answer,
  keywords: f.keywords,
  active: true,
}))

const res = await fetch(`${URL}/rest/v1/faqs?on_conflict=ref`, {
  method: 'POST',
  headers: {
    apikey: KEY,
    Authorization: `Bearer ${KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'resolution=merge-duplicates,return=minimal',
  },
  body: JSON.stringify(rows),
})

if (!res.ok) {
  console.error(`❌ Error ${res.status}:`, await res.text())
  process.exit(1)
}

console.log('✅ FAQs cargadas correctamente.')
