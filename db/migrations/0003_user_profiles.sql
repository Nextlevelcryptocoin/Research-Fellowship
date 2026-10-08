CREATE TABLE IF NOT EXISTS users (
  firebase_uid TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
  firebase_uid TEXT PRIMARY KEY REFERENCES users(firebase_uid),
  first_name TEXT,
  last_name TEXT,
  mobile_number TEXT,
  country TEXT,
  state_province TEXT,
  date_of_birth DATE,
  gender TEXT,
  highest_qualification TEXT,
  institution TEXT,
  current_occupation TEXT,
  research_interest TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS profiles_country_idx ON profiles (country);
