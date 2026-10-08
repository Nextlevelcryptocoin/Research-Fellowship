CREATE TABLE IF NOT EXISTS fellowship_programs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  amount_minor BIGINT NOT NULL CHECK (amount_minor > 0),
  currency TEXT NOT NULL CHECK (currency = 'INR'),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO fellowship_programs (id, name, amount_minor, currency)
VALUES
  ('fel-1', 'Human Rights & International Law', 15000000, 'INR'),
  ('fel-2', 'Artificial Intelligence & Data Science', 15000000, 'INR'),
  ('fel-3', 'Quantum Computing & Technologies', 15000000, 'INR'),
  ('fel-4', 'Sustainable Development Goals', 15000000, 'INR'),
  ('fel-5', 'Climate Change & Environmental Science', 15000000, 'INR'),
  ('fel-6', 'Global Public Health', 15000000, 'INR'),
  ('fel-7', 'Space Science, Technology & Policy', 15000000, 'INR'),
  ('fel-8', 'Blockchain, FinTech & Digital Economy', 15000000, 'INR'),
  ('fel-9', 'Cybersecurity & Digital Governance', 15000000, 'INR'),
  ('fel-10', 'Peace, Conflict & International Relations', 15000000, 'INR'),
  ('fel-11', 'Education, Innovation & EdTech', 15000000, 'INR'),
  ('fel-12', 'Gender Equality & Social Inclusion', 15000000, 'INR'),
  ('fel-13', 'Business, Entrepreneurship & Sustainable Management', 15000000, 'INR')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY,
  applicant_uid TEXT NOT NULL,
  fellowship_id TEXT NOT NULL REFERENCES fellowship_programs(id),
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS applications_applicant_uid_idx
  ON applications (applicant_uid);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY,
  application_id TEXT NOT NULL REFERENCES applications(id),
  stripe_checkout_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT UNIQUE,
  amount_minor BIGINT NOT NULL CHECK (amount_minor > 0),
  currency TEXT NOT NULL CHECK (currency = 'INR'),
  payment_status TEXT NOT NULL CHECK (
    payment_status IN ('pending', 'paid', 'failed', 'expired')
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS payments_application_created_idx
  ON payments (application_id, created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS payments_one_pending_per_application_idx
  ON payments (application_id)
  WHERE payment_status = 'pending';

CREATE UNIQUE INDEX IF NOT EXISTS payments_one_paid_per_application_idx
  ON payments (application_id)
  WHERE payment_status = 'paid';

CREATE TABLE IF NOT EXISTS stripe_webhook_events (
  stripe_event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  processed_status TEXT NOT NULL CHECK (
    processed_status IN ('processing', 'processed', 'ignored')
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);
