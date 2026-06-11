-- ═══════════════════════════════════════════════════════════
--  klanmedia – Supabase Schema
--  Ausführen im Supabase SQL Editor (Dashboard → SQL Editor)
-- ═══════════════════════════════════════════════════════════

-- ── Leads (öffentliche Kontaktanfragen + Konfigurator-Daten) ──────────────────
CREATE TABLE IF NOT EXISTS leads (
  id                    uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  name                  text        NOT NULL,
  email                 text        NOT NULL,
  tel                   text,
  nachricht             text,
  konfig_paket          text,                        -- 'starter' | 'business' | 'premium' | 'enterprise'
  konfig_hosting        text,                        -- 'basic' | 'standard' | 'premium'
  konfig_features       text[],                      -- ['Content Starter', 'Google Business Profil', ...]
  konfig_preis_einmalig integer,                     -- Einmalpreis in Euro
  konfig_preis_monatlich integer,                    -- Monatspreis in Euro
  status                text        DEFAULT 'neu',   -- 'neu' | 'gelesen' | 'beantwortet'
  created_at            timestamp   DEFAULT now()
);

-- ── Customers ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS customers (
  id          uuid    DEFAULT gen_random_uuid() PRIMARY KEY,
  name        text    NOT NULL,
  email       text,
  tel         text,
  firma       text,
  adresse     text,
  plz         text,
  ort         text,
  website     text,
  notizen     text,
  lead_id     uuid    REFERENCES leads(id),
  created_at  timestamp DEFAULT now()
);

-- Migration: Falls die Tabelle bereits existiert, Spalten hinzufügen
ALTER TABLE customers ADD COLUMN IF NOT EXISTS website text;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS notizen text;

-- ── Projects ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id               uuid    DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id      uuid    REFERENCES customers(id),
  paket            text,
  hosting          text,
  features         text[],
  preis_einmalig   integer,
  preis_monatlich  integer,
  onboarding_data  jsonb,
  status           text    DEFAULT 'angebot',   -- 'angebot' | 'aktiv' | 'abgeschlossen'
  created_at       timestamp DEFAULT now()
);

-- ── Invoices ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS invoices (
  id               uuid    DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id       uuid    REFERENCES projects(id),
  customer_id      uuid    REFERENCES customers(id),
  rechnungsnummer  text,
  positionen       jsonb,
  betrag_gesamt    integer,
  datum            date,
  faellig_am       date,
  status           text    DEFAULT 'entwurf',   -- 'entwurf' | 'versendet' | 'bezahlt' | 'ueberfaellig'
  created_at       timestamp DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════
--  Row Level Security
-- ═══════════════════════════════════════════════════════════

ALTER TABLE leads     ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects  ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices  ENABLE ROW LEVEL SECURITY;

-- leads: anonymer INSERT (öffentliches Kontaktformular via API-Route mit service_role)
--        authentifizierte User dürfen alles
CREATE POLICY "Public insert leads"
  ON leads FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Auth full access leads"
  ON leads FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- customers / projects / invoices: nur authentifizierte User
CREATE POLICY "Auth full access customers"
  ON customers FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Auth full access projects"
  ON projects FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Auth full access invoices"
  ON invoices FOR ALL TO authenticated
  USING (true) WITH CHECK (true);
