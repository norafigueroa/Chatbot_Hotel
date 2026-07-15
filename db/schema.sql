-- =====================================================================
-- Esquema de base de datos — Chatbot Isla Chiquita (Supabase / PostgreSQL)
-- =====================================================================
-- Cómo usar: en el panel de Supabase, abrí "SQL Editor" y pegá/ejecutá
-- este archivo completo. Crea las tablas y las políticas de seguridad.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Tabla: faqs  (base de conocimiento del chatbot)
-- ---------------------------------------------------------------------
create table if not exists public.faqs (
  id          bigint generated always as identity primary key,
  ref         integer unique,               -- número original en el documento
  category    text        not null,
  question    text        not null,
  answer      text        not null,
  keywords    text[]      not null default '{}',
  active      boolean     not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists faqs_category_idx on public.faqs (category);
create index if not exists faqs_active_idx   on public.faqs (active);

-- ---------------------------------------------------------------------
-- Tabla: leads  (datos de contacto capturados por el chatbot)
-- ---------------------------------------------------------------------
create table if not exists public.leads (
  id            bigint generated always as identity primary key,
  name          text,
  phone         text,
  country       text,
  email         text,
  conversation  text,                        -- resumen/historial opcional
  source        text        not null default 'chatbot',
  created_at    timestamptz not null default now()
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);

-- ---------------------------------------------------------------------
-- (Opcional, fase 2) Tabla: conversations  (analítica de chats)
-- ---------------------------------------------------------------------
create table if not exists public.conversations (
  id          bigint generated always as identity primary key,
  session_id  text,
  messages    jsonb       not null default '[]',
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Trigger: mantener updated_at al día en faqs
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists faqs_set_updated_at on public.faqs;
create trigger faqs_set_updated_at
  before update on public.faqs
  for each row execute function public.set_updated_at();

-- =====================================================================
-- Seguridad (Row Level Security)
-- =====================================================================
-- Regla general:
--   * El backend usa la SERVICE ROLE key, que ignora RLS (acceso total).
--   * La ANON key (pública, usada en el navegador) solo puede LEER las FAQs
--     activas y NO puede leer leads. Las escrituras de leads las hace el
--     backend con la service role, nunca el navegador directamente.
-- =====================================================================

alter table public.faqs          enable row level security;
alter table public.leads         enable row level security;
alter table public.conversations enable row level security;

-- FAQs: lectura pública solo de las activas.
drop policy if exists "faqs public read" on public.faqs;
create policy "faqs public read"
  on public.faqs for select
  using (active = true);

-- leads y conversations: sin políticas públicas => nadie con anon key puede
-- leerlas ni escribirlas. Solo el backend (service role) tiene acceso.
