ALTER TABLE applications
  ADD COLUMN IF NOT EXISTS submission_data JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE UNIQUE INDEX IF NOT EXISTS applications_applicant_fellowship_unique_idx
  ON applications (applicant_uid, fellowship_id);
