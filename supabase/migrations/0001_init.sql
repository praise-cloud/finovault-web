-- 0001_init.sql — Finovault schema (inventory from lib/api/supabase/*.ts, 96 .from() refs)
-- Idempotent: safe to re-run. No RLS: BFF uses service-role key (bypasses RLS) with custom token auth.

-- ── users ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email               text NOT NULL UNIQUE,
  password_hash       text NOT NULL,
  full_name           text,
  avatar_url          text,
  primary_role        text,
  secondary_roles     jsonb NOT NULL DEFAULT '[]',
  scheme              text NOT NULL DEFAULT 'core',
  preferred_language  text NOT NULL DEFAULT 'en',
  preferred_currency  text NOT NULL DEFAULT 'MUR',
  created_at          timestamptz NOT NULL DEFAULT now(),
  business_profile    jsonb
);

-- ── auth ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sessions (
  token      text PRIMARY KEY,
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions (user_id);

CREATE TABLE IF NOT EXISTS password_resets (
  email      text NOT NULL UNIQUE,
  token      text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL
);

-- ── user_preferences (upsert onConflict: user_id ── PK) ─────────────────────
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id            uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  financial_goals    jsonb,
  risk_tolerance     text,
  money_fears        jsonb,
  onboarding_completed boolean NOT NULL DEFAULT false,
  updated_at         timestamptz NOT NULL DEFAULT now()
);

-- ── accounts ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS accounts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name        text NOT NULL,
  type        text NOT NULL DEFAULT 'checking',
  institution text,
  balance     numeric(20, 4) NOT NULL DEFAULT 0,
  currency    text NOT NULL DEFAULT 'MUR',
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_accounts_user_created ON accounts (user_id, created_at DESC);

-- ── transactions ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS transactions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_id     uuid REFERENCES accounts(id) ON DELETE SET NULL,
  amount         numeric(20, 4) NOT NULL,
  currency       text NOT NULL DEFAULT 'MUR',
  direction      text NOT NULL DEFAULT 'out',
  category       text,
  merchant_name  text,
  date           timestamptz NOT NULL DEFAULT now(),
  is_expense     boolean NOT NULL DEFAULT true,
  is_recurring   boolean NOT NULL DEFAULT false,
  status         text NOT NULL DEFAULT 'posted'
);
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON transactions (user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_account ON transactions (account_id);

-- ── budgets (upsert onConflict (user_id, category)) ─────────────────────────
CREATE TABLE IF NOT EXISTS budgets (
  id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id  uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category text NOT NULL DEFAULT 'general',
  amount   numeric(20, 4) NOT NULL DEFAULT 0,
  period   text NOT NULL DEFAULT 'monthly',
  UNIQUE (user_id, category)
);

-- ── goals ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS goals (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name           text NOT NULL,
  type           text,
  target_amount  numeric(20, 4) NOT NULL,
  current_amount numeric(20, 4) NOT NULL DEFAULT 0,
  target_date    timestamptz,
  completed      boolean NOT NULL DEFAULT false
);
CREATE INDEX IF NOT EXISTS idx_goals_user ON goals (user_id);

CREATE TABLE IF NOT EXISTS goal_contributions (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id           uuid NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  amount            numeric(20, 4) NOT NULL,
  date              timestamptz NOT NULL DEFAULT now(),
  source_account_id uuid REFERENCES accounts(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_goal_contributions_goal ON goal_contributions (goal_id, date DESC);

-- ── pension ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pension_plans (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  short_pot_target    numeric(20, 4) NOT NULL DEFAULT 0,
  long_pot_target     numeric(20, 4) NOT NULL DEFAULT 0,
  frequency           text NOT NULL DEFAULT 'monthly',
  contribution_amount numeric(20, 4) NOT NULL DEFAULT 0,
  current_short_pot   numeric(20, 4) NOT NULL DEFAULT 0,
  current_long_pot    numeric(20, 4) NOT NULL DEFAULT 0,
  assumed_return_pct  numeric(8, 4) NOT NULL DEFAULT 0.05,
  inflation_pct       numeric(8, 4) NOT NULL DEFAULT 0.03,
  current_age         int NOT NULL DEFAULT 30,
  retirement_age      int NOT NULL DEFAULT 60,
  auto_debit          boolean NOT NULL DEFAULT false,
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pension_contributions (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id           uuid NOT NULL REFERENCES pension_plans(id) ON DELETE CASCADE,
  pot               text NOT NULL DEFAULT 'short',
  amount            numeric(20, 4) NOT NULL,
  date              timestamptz NOT NULL DEFAULT now(),
  source_account_id uuid REFERENCES accounts(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_pension_contributions_plan ON pension_contributions (plan_id, date DESC);

-- ── security ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS security_overviews (
  user_id              uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  score                int NOT NULL DEFAULT 72,
  two_factor_enabled   boolean NOT NULL DEFAULT false,
  last_password_change timestamptz
);

CREATE TABLE IF NOT EXISTS security_events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       text NOT NULL,
  description text,
  severity    text NOT NULL DEFAULT 'low',
  date        timestamptz NOT NULL DEFAULT now(),
  resolved    boolean NOT NULL DEFAULT false
);
CREATE INDEX IF NOT EXISTS idx_security_events_user ON security_events (user_id);

CREATE TABLE IF NOT EXISTS security_devices (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name      text NOT NULL,
  last_seen timestamptz NOT NULL DEFAULT now(),
  trusted   boolean NOT NULL DEFAULT false
);
CREATE INDEX IF NOT EXISTS idx_security_devices_user ON security_devices (user_id);

-- ── invoices / vendors ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS invoices (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_name text NOT NULL,
  amount      numeric(20, 4) NOT NULL,
  currency    text NOT NULL DEFAULT 'MUR',
  due_date    timestamptz,
  status      text NOT NULL DEFAULT 'sent'
);
CREATE INDEX IF NOT EXISTS idx_invoices_user_due ON invoices (user_id, due_date DESC);

CREATE TABLE IF NOT EXISTS vendors (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name             text NOT NULL,
  total_spend      numeric(20, 4) NOT NULL DEFAULT 0,
  reliability_score numeric(8, 2) NOT NULL DEFAULT 80
);
CREATE INDEX IF NOT EXISTS idx_vendors_user ON vendors (user_id);

-- ── transfers / payees ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS transfers (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  source_account_id  uuid REFERENCES accounts(id) ON DELETE SET NULL,
  payee_name         text NOT NULL,
  destination        text NOT NULL,
  amount             numeric(20, 4) NOT NULL,
  fee                numeric(20, 4) NOT NULL DEFAULT 0,
  total              numeric(20, 4) NOT NULL,
  status             text NOT NULL DEFAULT 'completed',
  created_at         timestamptz NOT NULL DEFAULT now(),
  external_ref       text,
  idempotency_key    text NOT NULL,
  UNIQUE (user_id, idempotency_key)
);
CREATE INDEX IF NOT EXISTS idx_transfers_user_created ON transfers (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS payees (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name        text NOT NULL,
  destination text
);
CREATE INDEX IF NOT EXISTS idx_payees_user ON payees (user_id);

-- ── bills ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bills (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category     text NOT NULL DEFAULT 'general',
  biller_name  text NOT NULL,
  amount       numeric(20, 4) NOT NULL,
  status       text NOT NULL DEFAULT 'paid',
  date         timestamptz NOT NULL DEFAULT now(),
  customer_ref text,
  scheduled_for timestamptz
);
CREATE INDEX IF NOT EXISTS idx_bills_user_date ON bills (user_id, date DESC);

-- ── notifications ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title      text NOT NULL,
  body       text NOT NULL DEFAULT '',
  type       text NOT NULL DEFAULT 'system',
  link       text,
  read_at    timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON notifications (user_id, created_at DESC);