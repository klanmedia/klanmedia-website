-- ============================================================
-- klanmedia — Supabase Setup
-- Einmal im SQL Editor ausführen: supabase.com → SQL Editor
-- ============================================================

-- Feature Flags Tabelle
create table if not exists feature_flags (
  id          uuid default gen_random_uuid() primary key,
  key         text unique not null,
  value       boolean default true,
  label       text not null,
  description text,
  updated_at  timestamptz default now()
);

-- Kontaktanfragen Tabelle
create table if not exists contact_requests (
  id         uuid default gen_random_uuid() primary key,
  name       text not null,
  email      text not null,
  phone      text,
  company    text,
  message    text not null,
  config     text,
  status     text default 'neu' check (status in ('neu', 'gelesen', 'beantwortet')),
  created_at timestamptz default now()
);

-- Row Level Security aktivieren
alter table feature_flags    enable row level security;
alter table contact_requests enable row level security;

-- Service Role hat vollen Zugriff (unser Server-Code)
create policy "service_role_all_flags"    on feature_flags    for all using (true);
create policy "service_role_all_contacts" on contact_requests for all using (true);

-- Standard Feature Flags einfügen
insert into feature_flags (key, value, label, description) values
  ('konfigurator_visible',      false, 'Paket-Konfigurator',    'Zeigt den interaktiven Konfigurator öffentlich an (/konfigurator)'),
  ('service_bundles_visible',   true,  'Bundle-Pakete',          'Zeigt Bundle-Pakete im Services-Bereich'),
  ('service_content_visible',   true,  'Content Creation',       'Zeigt Content Creation im Services-Bereich'),
  ('service_google_visible',    true,  'Google Business',        'Zeigt Google Business & Review Management'),
  ('demos_visible',             true,  'Demos-Seite',            'Zeigt die Demos-Seite in der Navigation'),
  ('produkte_visible',          false, 'Produkte-Seite',         'Zeigt die Produkte-Seite in der Navigation')
on conflict (key) do nothing;
