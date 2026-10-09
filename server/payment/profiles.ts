import { ApiError } from './http.js';

export interface ApplicantProfileInput {
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  stateProvince: string;
  dateOfBirth: string;
  gender: string;
  highestQualification: string;
  institution: string;
  currentOccupation: string;
  researchInterests: string;
}

const PROFILE_FIELD_LIMITS: Record<keyof ApplicantProfileInput, number> = {
  firstName: 100,
  lastName: 100,
  phone: 40,
  country: 100,
  stateProvince: 100,
  dateOfBirth: 10,
  gender: 40,
  highestQualification: 200,
  institution: 200,
  currentOccupation: 200,
  researchInterests: 2_000
};

export function parseApplicantProfile(body: unknown): ApplicantProfileInput {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    throw new ApiError(400, 'A JSON applicant profile is required.');
  }

  const input = body as Record<string, unknown>;
  if (
    'uid' in input ||
    'firebase_uid' in input ||
    'userId' in input ||
    'email' in input ||
    'role' in input ||
    'admin' in input
  ) {
    throw new ApiError(400, 'Applicant identity, email, and roles are server-controlled.');
  }

  const profile = {} as ApplicantProfileInput;
  for (const [field, maxLength] of Object.entries(PROFILE_FIELD_LIMITS) as [
    keyof ApplicantProfileInput,
    number
  ][]) {
    const value = input[field];
    if (typeof value !== 'string') {
      throw new ApiError(400, `Profile field "${field}" must be text.`);
    }
    const normalized = value.trim();
    if (!normalized) {
      throw new ApiError(400, `Profile field "${field}" is required.`);
    }
    if (normalized.length > maxLength) {
      throw new ApiError(400, `Profile field "${field}" exceeds its maximum length.`);
    }
    profile[field] = normalized;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(profile.dateOfBirth)) {
    throw new ApiError(400, 'Enter a valid date of birth.');
  }
  const dateOfBirth = new Date(`${profile.dateOfBirth}T00:00:00.000Z`);
  if (
    Number.isNaN(dateOfBirth.getTime()) ||
    dateOfBirth.toISOString().slice(0, 10) !== profile.dateOfBirth ||
    dateOfBirth.getTime() > Date.now()
  ) {
    throw new ApiError(400, 'Enter a valid date of birth.');
  }

  return profile;
}

export interface ApplicantProfileRow {
  first_name: string | null;
  last_name: string | null;
  mobile_number: string | null;
  country: string | null;
  state_province: string | null;
  date_of_birth: Date | string | null;
  gender: string | null;
  highest_qualification: string | null;
  institution: string | null;
  current_occupation: string | null;
  research_interest: string | null;
  email: string;
  email_verified: boolean;
  created_at?: Date | string;
  updated_at?: Date | string;
}

export function toApplicantProfile(row: ApplicantProfileRow) {
  const toIsoDate = (value: Date | string | null | undefined) =>
    value instanceof Date ? value.toISOString().slice(0, 10) : value ? String(value).slice(0, 10) : '';
  return {
    firstName: row.first_name || '',
    lastName: row.last_name || '',
    email: row.email,
    emailVerified: row.email_verified,
    phone: row.mobile_number || '',
    country: row.country || '',
    stateProvince: row.state_province || '',
    dateOfBirth: toIsoDate(row.date_of_birth),
    gender: row.gender || '',
    highestQualification: row.highest_qualification || '',
    institution: row.institution || '',
    currentOccupation: row.current_occupation || '',
    researchInterests: row.research_interest || '',
    createdAt: toIsoDate(row.created_at),
    updatedAt: toIsoDate(row.updated_at)
  };
}

const PROFILE_COLUMN_NAMES: Record<keyof ApplicantProfileInput, string> = {
  firstName: 'first_name',
  lastName: 'last_name',
  phone: 'mobile_number',
  country: 'country',
  stateProvince: 'state_province',
  dateOfBirth: 'date_of_birth',
  gender: 'gender',
  highestQualification: 'highest_qualification',
  institution: 'institution',
  currentOccupation: 'current_occupation',
  researchInterests: 'research_interest'
};

export function parseApplicantProfilePatch(
  body: unknown
): Partial<ApplicantProfileInput> {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    throw new ApiError(400, 'A JSON applicant profile is required.');
  }

  const input = body as Record<string, unknown>;
  if (
    'uid' in input ||
    'firebase_uid' in input ||
    'userId' in input ||
    'email' in input ||
    'role' in input ||
    'admin' in input
  ) {
    throw new ApiError(400, 'Applicant identity, email, and roles are server-controlled.');
  }

  const profile: Partial<ApplicantProfileInput> = {};
  for (const [field, value] of Object.entries(input)) {
    if (!Object.prototype.hasOwnProperty.call(PROFILE_FIELD_LIMITS, field)) {
      throw new ApiError(400, `Profile field "${field}" is not supported.`);
    }
    if (typeof value !== 'string') {
      throw new ApiError(400, `Profile field "${field}" must be text.`);
    }
    const normalized = value.trim();
    const typedField = field as keyof ApplicantProfileInput;
    if (normalized.length > PROFILE_FIELD_LIMITS[typedField]) {
      throw new ApiError(400, `Profile field "${field}" exceeds its maximum length.`);
    }
    profile[typedField] = normalized;
  }
  if (Object.keys(profile).length === 0) {
    throw new ApiError(400, 'At least one profile field is required.');
  }
  if (profile.dateOfBirth) {
    const dateOfBirth = new Date(`${profile.dateOfBirth}T00:00:00.000Z`);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(profile.dateOfBirth) ||
      Number.isNaN(dateOfBirth.getTime()) ||
      dateOfBirth.toISOString().slice(0, 10) !== profile.dateOfBirth ||
      dateOfBirth.getTime() > Date.now()
    ) {
      throw new ApiError(400, 'Enter a valid date of birth.');
    }
  }
  return profile;
}

export function getProfileColumnName(field: keyof ApplicantProfileInput): string {
  return PROFILE_COLUMN_NAMES[field];
}
