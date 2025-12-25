# Arquitetura da Presença Digital — Página Premium

Uma única página premium com thumbnail e liberação de vídeo após o envio do e-mail.

## Rodar localmente

```bash
python -m http.server 8000
```

Acesse `http://localhost:8000`.

## Configurar vídeo e WhatsApp

No `app.js`, ajuste:

```js
const VIDEO_URL = "https://www.youtube.com/embed/VIDEO_ID";
const WHATSAPP_NUMBER = "5549988971962";
```

## Salvar e-mail no Supabase

Em `app.js`, configure:

```js
const SUPABASE_URL = "https://SEU-PROJETO.supabase.co";
const SUPABASE_ANON_KEY = "SUA_SUPABASE_ANON_KEY";
const SUPABASE_TABLE = "leads";
```

### SQL pronto para Supabase

Cole no **SQL Editor** do Supabase:

```sql
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

create policy "Allow insert for anon"
on public.leads
for insert
to anon
with check (true);
```

## Thumbnail

Coloque sua thumbnail em `assets/thumbnail.png`.

## Vídeo do YouTube

Use um link embed do YouTube (`https://www.youtube.com/embed/VIDEO_ID`) ou um link comum
(`https://www.youtube.com/watch?v=VIDEO_ID`). O app converte automaticamente para embed.
